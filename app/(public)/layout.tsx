import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AvisosClient from "@/components/public/AvisosClient";
import { AoVivoProvider } from "@/components/public/AoVivo";
import { ChatFlutuante, ChatProvider } from "@/components/chat/ChatCentral";
import { listarAvisosAtivos, listarConteudo } from "@/lib/data";

// Sem cache: o servidor renderiza cada acesso com o dado atual do Firestore
// e, no navegador, tudo segue em tempo real (AoVivoProvider, AvisosClient).
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [conteudo, avisos] = await Promise.all([listarConteudo(), listarAvisosAtivos().catch(() => [])]);
  return (
    <AoVivoProvider inicial={conteudo}>
      <ChatProvider>
        <div className="topo-fixo">
          <AvisosClient avisosIniciais={avisos} />
          <Header />
        </div>
        <main id="conteudo">{children}</main>
        <Footer />
        <ChatFlutuante />
      </ChatProvider>
    </AoVivoProvider>
  );
}
