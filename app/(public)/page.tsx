import Secoes from "@/components/secoes/Secoes";
import { PAGINA_INICIO } from "@/lib/siteinstitucional/regrasSite";

// Home = as seções da página "inicio" (admSite → Site → Seções).
export default function HomePage() {
  return <Secoes pagina={PAGINA_INICIO} />;
}
