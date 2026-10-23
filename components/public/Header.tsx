"use client";

// Cabeçalho no layout do site ViaMob360 (mesmas classes: topbar/nav/brand/
// links/nav-actions): logo, menu com o item da página atual em azul e
// sublinhado, busca e o botão do topo. Os itens vêm do admSite → Site → Menu
// e rodapé (local "menu" ou "ambos"; mesmo GRUPO = submenu) e o botão da
// Configuração — nada de texto fixo aqui.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, MessageCircle, Search, X } from "lucide-react";
import { useConfiguracao, useConteudo } from "./AoVivo";
import LinkSite from "./LinkSite";
import { BotaoTema } from "./Tema";
import { hrefDoMenu } from "@/lib/siteinstitucional/regrasSite";
import type { ItemMenu } from "@/types/conteudo";

// Logo padrão da P2P Corp (public/images; fonte em documentacao/logo/logo.html),
// usado enquanto a Configuração do site não tiver logo cadastrado.
const LOGO_PADRAO = "/images/logo-p2pcorp.png";
const LOGO_PADRAO_BRANCO = "/images/logo-p2pcorp-branco.png";

export function LogoMarca({ branco = false }: { branco?: boolean }) {
  const c = useConfiguracao();
  const src = branco ? c.logoRodapeUrl || c.logoUrl || LOGO_PADRAO_BRANCO : c.logoUrl || LOGO_PADRAO;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={c.nomeSite} className={branco && !c.logoRodapeUrl && c.logoUrl ? "logo-clara" : undefined} />;
}

// Logo do topo: a versão normal no tema claro e a de fundo escuro no tema
// escuro (o CSS mostra uma ou outra pelo html[data-tema]).
function LogoTopo() {
  return (
    <>
      <span className="logo-tema-claro"><LogoMarca /></span>
      <span className="logo-tema-escuro"><LogoMarca branco /></span>
    </>
  );
}

// Agrupa os itens: sem grupo = link direto; com grupo = submenu, na posição do 1º item do grupo.
export function agruparMenu(itens: ItemMenu[]): ({ tipo: "item"; item: ItemMenu } | { tipo: "grupo"; nome: string; itens: ItemMenu[] })[] {
  const saida: any[] = [];
  const grupos = new Map<string, ItemMenu[]>();
  itens.forEach((i) => {
    if (!i.grupo) { saida.push({ tipo: "item", item: i }); return; }
    if (!grupos.has(i.grupo)) { const lista: ItemMenu[] = []; grupos.set(i.grupo, lista); saida.push({ tipo: "grupo", nome: i.grupo, itens: lista }); }
    grupos.get(i.grupo)!.push(i);
  });
  return saida;
}

const hrefItem = (item: ItemMenu) => (item.tipo === "chat" ? "chat" : hrefDoMenu(item) ?? "");

// Item da página atual: "/" ou "/#inicio" (Início) só na Home; "/solucoes"
// também em /solucoes/<slug>; outras âncoras da Home não ficam marcadas.
function ehAtual(href: string, rota: string) {
  if (href === "/#inicio") return rota === "/";
  if (!href.startsWith("/") || href.includes("#")) return false;
  return href === "/" ? rota === "/" : rota === href || rota.startsWith(href + "/");
}

export function LinkMenu({ item, className, onClick }: { item: ItemMenu; className?: string; onClick?: () => void }) {
  return <LinkSite href={hrefItem(item)} className={className} novaAba={item.novaAba} onClick={onClick}>{item.rotulo}</LinkSite>;
}

export default function Header() {
  const c = useConfiguracao();
  const { menu } = useConteudo();
  const rota = usePathname() || "/";
  const itens = agruparMenu(menu.filter((m) => m.local !== "rodape"));
  const [aberto, setAberto] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const fechar = () => { setAberto(false); setSub(null); };
  const classe = (item: ItemMenu) => (ehAtual(hrefItem(item), rota) ? "ativo" : undefined);
  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/" aria-label={`${c.nomeSite} — início`} onClick={fechar}><LogoTopo /></Link>
        <nav className={`links${aberto ? " aberto" : ""}`} aria-label="Menu principal">
          {itens.map((g) => g.tipo === "item" ? (
            <LinkMenu key={g.item.id} item={g.item} className={classe(g.item)} onClick={fechar} />
          ) : (
            <div key={g.nome} className={`menu-grupo${sub === g.nome ? " aberto" : ""}`} onMouseLeave={() => setSub(null)}>
              <button type="button" aria-expanded={sub === g.nome} onClick={() => setSub(sub === g.nome ? null : g.nome)} onMouseEnter={() => setSub(g.nome)}>
                {g.nome} <ChevronDown size={16} aria-hidden />
              </button>
              <div className="submenu">
                {g.itens.map((i) => <LinkMenu key={i.id} item={i} className={classe(i)} onClick={fechar} />)}
              </div>
            </div>
          ))}
          {c.botaoTopoTexto && <LinkSite href={c.botaoTopoLink} className="btn btn-primary so-mobile" onClick={fechar}><MessageCircle size={18} /> {c.botaoTopoTexto}</LinkSite>}
        </nav>
        <BotaoTema />
        <div className="nav-actions">
          <Link className="busca" href="/solucoes" aria-label="Buscar nas soluções"><Search size={19} /></Link>
          {c.botaoTopoTexto && <LinkSite href={c.botaoTopoLink} className="btn btn-primary btn-baixar"><MessageCircle size={19} /> {c.botaoTopoTexto}</LinkSite>}
        </div>
        <button className="menu-btn" type="button" onClick={() => setAberto((v) => !v)} aria-label={aberto ? "Fechar menu" : "Abrir menu"} aria-expanded={aberto}>
          {aberto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>
  );
}
