import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { listarConteudo } from "@/lib/data";
import { scriptTema } from "@/lib/tema";

// Títulos em Poppins, texto em Inter. Nome, SEO e favicon vêm da
// Configuração do site (admSite → Site → Configuração do site).
const titulo = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--fonte-titulo", display: "swap" });
const texto = Inter({ subsets: ["latin"], variable: "--fonte-texto", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { configuracao: c } = await listarConteudo();
  return {
    title: { default: c.seoTitulo || c.nomeSite, template: `%s | ${c.nomeSite}` },
    description: c.seoDescricao || c.slogan,
    icons: { icon: c.faviconUrl || "/images/simbolo-p2pcorp.png" },
    openGraph: { title: c.seoTitulo || c.nomeSite, description: c.seoDescricao || c.slogan, siteName: c.nomeSite, locale: "pt_BR", type: "website" },
  };
}

// Tema claro/escuro (Configuração do site → Tema do site): o script do <head>
// marca <html data-tema> antes de pintar; depois o Tema.tsx acompanha ao vivo.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { configuracao: c } = await listarConteudo();
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable}`} data-tema={c.tema === "escuro" ? "escuro" : "claro"} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: scriptTema(c.tema, c.temaBotao) }} /></head>
      <body>{children}</body>
    </html>
  );
}
