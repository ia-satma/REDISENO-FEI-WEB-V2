import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingDemoButton from "./components/FloatingDemoButton";
import CookieBanner from "./components/CookieBanner";
import EyebrowVisibility from "./components/EyebrowVisibility";
import { Toaster } from "./components/ui/toaster";
import { useSmoothScroll, scrollToTop } from "./hooks/useSmoothScroll";
import { SiteContentProvider } from "./hooks/useSiteContent";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Metodologia from "./pages/Metodologia";
import Materialidad from "./pages/Materialidad";
import Impacto from "./pages/Impacto";
import Seguridad from "./pages/Seguridad";
import Contacto from "./pages/Contacto";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import NotFound from "./pages/not-found";
// Admin + portal are code-split — they never load on the public site bundle.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminAgents = lazy(() => import("./pages/admin/AdminAgents"));
const AdminPipeline = lazy(() => import("./pages/admin/AdminPipeline"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AccesoPage = lazy(() => import("./pages/AccesoPage"));
const PortalPage = lazy(() => import("./pages/PortalPage"));
const PortalOperationPage = lazy(() => import("./pages/PortalOperationPage"));

function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  const isPortal = location.startsWith("/portal") || location.startsWith("/acceso");

  // Payana-style smooth scroll on the public site (respects reduced-motion).
  useSmoothScroll();

  // Start every route at the top (fix: nav kept the previous scroll position).
  useEffect(() => {
    scrollToTop(true);
  }, [location]);

  return (
    <SiteContentProvider>
    <EyebrowVisibility />
    <div className={`flex min-h-screen flex-col ${!isAdmin && !isPortal ? "noise-overlay" : ""}`}>
      {!isAdmin && !isPortal && <Header />}
      <Toaster />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-400">Cargando…</div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/servicios" component={Servicios} />
          <Route path="/metodologia" component={Metodologia} />
          <Route path="/materialidad" component={Materialidad} />
          <Route path="/impacto" component={Impacto} />
          <Route path="/seguridad" component={Seguridad} />
          <Route path="/implementacion" component={Metodologia} />
          <Route path="/contacto" component={Contacto} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/faq" component={FAQ} />
          <Route path="/aviso-privacidad" component={Legal} />
          <Route path="/terminos" component={Legal} />
          <Route path="/politica-seguridad" component={Legal} />
          <Route path="/cookies" component={Legal} />

          {/* Portal — client access */}
          <Route path="/acceso" component={AccesoPage} />
          <Route path="/acceso/verificar" component={AccesoPage} />
          <Route path="/portal" component={PortalPage} />
          <Route path="/portal/op/:opId" component={PortalOperationPage} />

          {/* Admin */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/agents" component={AdminAgents} />
          <Route path="/admin/pipeline" component={AdminPipeline} />
          <Route path="/admin/clients" component={AdminClients} />
          <Route path="/admin/content" component={AdminContent} />
          <Route path="/admin" component={AdminDashboard} />

          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </main>
      {!isAdmin && !isPortal && <Footer />}
      {!isAdmin && !isPortal && <FloatingDemoButton />}
      {!isAdmin && !isPortal && <CookieBanner />}
    </div>
    </SiteContentProvider>
  );
}

export default App;
