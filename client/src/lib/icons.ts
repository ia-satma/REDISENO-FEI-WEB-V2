import {
  FileWarning, Scale, ShieldAlert, TrendingDown, Receipt, Building2, Users,
  BrainCircuit, Cpu, FolderCheck, FileSearch, ShieldCheck, CheckCircle2,
  Search, FileStack, Gavel, Inbox, Layers, ClipboardList, Package, FileCheck2,
  Lock, Workflow, Newspaper, HelpCircle, TrendingUp,
  Boxes, Mail, Banknote, BookOpen, Calculator, type LucideIcon,
} from "lucide-react";

/** Maps content-config icon names to lucide components. */
export const ICONS: Record<string, LucideIcon> = {
  FileWarning, Scale, ShieldAlert, TrendingDown, Receipt, Building2, Users,
  BrainCircuit, Cpu, FolderCheck, FileSearch, ShieldCheck, CheckCircle2,
  Search, FileStack, Gavel, Inbox, Layers, ClipboardList, Package, FileCheck2,
  Lock, Workflow, Newspaper, HelpCircle, TrendingUp,
  Boxes, Mail, Banknote, BookOpen, Calculator,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? ShieldCheck;
}
