// ---------------------------------------------------------------------------
// FEI Agent — Spanish Orthography (Agente clave FEI)
// ---------------------------------------------------------------------------

import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ExecutionContext, AgentEvent } from "../core/types";
import { getDb } from "../../db";
import { blogPosts } from "../../../shared/schema";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Diccionario fiscal: errores comunes de ortografía en español fiscal
// Mapa de forma incorrecta → forma correcta
// ---------------------------------------------------------------------------
const FISCAL_DICTIONARY = new Map<string, string>([
  // Tildes faltantes en términos fiscales
  ["articulo", "artículo"],
  ["calculo", "cálculo"],
  ["operacion", "operación"],
  ["diagnostico", "diagnóstico"],
  ["poliza", "póliza"],
  ["regimen", "régimen"],
  ["codigo", "código"],
  ["credito", "crédito"],
  ["debito", "débito"],
  ["deduccion", "deducción"],
  ["declaracion", "declaración"],
  ["facturacion", "facturación"],
  ["obligacion", "obligación"],
  ["contribucion", "contribución"],
  ["recaudacion", "recaudación"],
  ["retencion", "retención"],
  ["devolucion", "devolución"],
  ["compensacion", "compensación"],
  ["liquidacion", "liquidación"],
  ["notificacion", "notificación"],
  ["verificacion", "verificación"],
  ["fiscalizacion", "fiscalización"],
  ["determinacion", "determinación"],
  ["resolucion", "resolución"],
  ["impugnacion", "impugnación"],
  ["prescripcion", "prescripción"],
  ["caducidad", "caducidad"],
  ["tramite", "trámite"],
  ["dictamen", "dictamen"],
  ["organo", "órgano"],
  ["juridico", "jurídico"],
  ["economico", "económico"],
  ["publico", "público"],
  ["regimenes", "regímenes"],
  ["deficit", "déficit"],
  ["superavit", "superávit"],
  ["calificacion", "calificación"],
  ["actualizacion", "actualización"],
  ["amortizacion", "amortización"],
  ["depreciacion", "depreciación"],
  ["enajenacion", "enajenación"],
  ["adquisicion", "adquisición"],
  ["consolidacion", "consolidación"],
  ["reestructuracion", "reestructuración"],
  ["disolucion", "disolución"],
  ["escision", "escisión"],
  ["fusion", "fusión"],
  ["conciliacion", "conciliación"],
  ["auditoria", "auditoría"],
  ["garantia", "garantía"],
  ["comprobacion", "comprobación"],
  ["materialidad", "materialidad"],
  ["razon social", "razón social"],
  // Acrónimos y siglas que se escriben mal
  ["cfdi", "CFDI"],
  ["sat", "SAT"],
  ["lisr", "LISR"],
  ["liva", "LIVA"],
  ["cff", "CFF"],
  ["isr", "ISR"],
  ["iva", "IVA"],
  ["rif", "RIF"],
  ["resico", "RESICO"],
  ["imss", "IMSS"],
  ["infonavit", "INFONAVIT"],
]);

const CONFIG: AgentConfig = {
  agentType: "orthography",
  name: "Spanish Orthography",
  description:
    "Corrige ortografía española con énfasis en terminología fiscal mexicana. Dos pasadas: diccionario + LLM.",
  systemPrompt: `Eres un corrector ortográfico experto en español mexicano, especializado en textos fiscales y tributarios.

Tu tarea es revisar el texto proporcionado y corregir SOLAMENTE errores ortográficos sutiles que un diccionario simple no detecta:
- Concordancia de género y número
- Uso correcto de "de" vs "dé", "si" vs "sí", "el" vs "él", "mas" vs "más"
- Puntuación: comas en enumeraciones, puntos y coma en cláusulas legales
- Tildes en palabras compuestas y formas verbales
- Uso de mayúsculas en nombres propios de leyes e instituciones

NO modifiques:
- El contenido sustancial ni las cifras
- Términos técnicos fiscales que ya estén correctos
- La estructura del documento
- Acrónimos que ya estén en mayúsculas

Devuelve SOLO un JSON (sin markdown wrapping):
{
  "correctedText": "texto corregido completo",
  "corrections": [
    { "original": "texto original", "corrected": "texto corregido", "rule": "regla aplicada" }
  ]
}`,
  model: "claude-sonnet-4-20250514",
  temperature: 0.1,
  maxTokens: 4096,
  skills: ["orthography", "fiscal_terminology"],
  enabled: true,
  concurrency: 1,
  retryPolicy: { maxRetries: 2, baseDelayMs: 1000, backoffMultiplier: 2 },
};

class SpanishOrthographyAgent extends BaseAgent {
  constructor() {
    super(CONFIG);
  }

  async execute(
    context: ExecutionContext,
    payload: Record<string, unknown>,
  ): Promise<AgentResult> {
    const start = Date.now();
    const events: AgentEvent[] = [];
    const postId = payload.postId as number;

    if (!postId) {
      return this.failureResult("postId es requerido", events, Date.now() - start);
    }

    events.push(this.createEvent(context.jobId, "started", `Revisión ortográfica post ${postId}`));

    try {
      const db = getDb();
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, postId))
        .limit(1);

      const post = rows[0];
      if (!post) {
        return this.failureResult(`Post ${postId} no encontrado`, events, Date.now() - start);
      }

      // --- PASADA 1: Diccionario (rápido, sin LLM) ---
      const dictionaryCorrections: Array<{
        original: string;
        corrected: string;
        rule: string;
      }> = [];
      let text = post.content;

      for (const [wrong, right] of Array.from(FISCAL_DICTIONARY.entries())) {
        // Buscar como palabra completa, case-insensitive
        const regex = new RegExp(`\\b${escapeRegex(wrong)}\\b`, "gi");
        const matches = text.match(regex);
        if (matches) {
          for (const match of matches) {
            // No corregir si ya está correcto (misma capitalización)
            if (match === right) continue;
            // Para acrónimos, solo corregir si está en minúsculas
            if (right === right.toUpperCase() && match === right) continue;
            dictionaryCorrections.push({
              original: match,
              corrected: right,
              rule: "diccionario_fiscal",
            });
          }
          text = text.replace(regex, right);
        }
      }

      events.push(
        this.createEvent(context.jobId, "progress", "Pasada 1 (diccionario) completada", {
          dictionaryCorrections: dictionaryCorrections.length,
        }),
      );

      // --- PASADA 2: LLM para errores sutiles ---
      let llmCorrections: Array<{
        original: string;
        corrected: string;
        rule: string;
      }> = [];

      try {
        const llmResponse = await this.callLLM([
          {
            role: "user",
            content: `Revisa el siguiente texto fiscal mexicano y corrige errores ortográficos sutiles:\n\n${text}`,
          },
        ]);

        let parsed: { correctedText: string; corrections: typeof llmCorrections };
        try {
          parsed = JSON.parse(llmResponse);
          text = parsed.correctedText;
          llmCorrections = parsed.corrections ?? [];
        } catch {
          // Si el LLM no devuelve JSON, usar el texto como corrección
          if (llmResponse && !llmResponse.startsWith("[LLM no disponible")) {
            text = llmResponse;
          }
        }
      } catch (err) {
        // LLM fallback — la pasada de diccionario ya cubrió lo básico
        events.push(
          this.createEvent(context.jobId, "info", "Pasada LLM omitida: " + (err instanceof Error ? err.message : "error")),
        );
      }

      const allCorrections = [...dictionaryCorrections, ...llmCorrections];
      const totalCorrections = allCorrections.length;
      const needsManualReview = totalCorrections > 10;

      // Actualizar post en DB
      await db
        .update(blogPosts)
        .set({ content: text, updatedAt: new Date() })
        .where(eq(blogPosts.id, postId));

      // También corregir título
      let titleCorrected = post.title;
      for (const [wrong, right] of Array.from(FISCAL_DICTIONARY.entries())) {
        const regex = new RegExp(`\\b${escapeRegex(wrong)}\\b`, "gi");
        titleCorrected = titleCorrected.replace(regex, right);
      }
      if (titleCorrected !== post.title) {
        await db
          .update(blogPosts)
          .set({ title: titleCorrected, updatedAt: new Date() })
          .where(eq(blogPosts.id, postId));
      }

      events.push(
        this.createEvent(context.jobId, "completed", `Ortografía corregida: ${totalCorrections} correcciones`, {
          totalCorrections,
          needsManualReview,
        }),
      );

      return this.successResult(
        {
          postId,
          corrections: allCorrections,
          needsManualReview,
        },
        {
          dictionaryCorrections: dictionaryCorrections.length,
          llmCorrections: llmCorrections.length,
          totalCorrections,
          flaggedForReview: needsManualReview ? 1 : 0,
        },
        events,
        Date.now() - start,
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      events.push(this.createEvent(context.jobId, "failed", errorMsg));
      return this.failureResult(errorMsg, events, Date.now() - start);
    }
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const orthographyAgent = new SpanishOrthographyAgent();
