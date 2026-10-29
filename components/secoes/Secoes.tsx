"use client";

// Montador de páginas: cada SEÇÃO (admSite → Site → Seções) vira um bloco,
// na ordem cadastrada. O LAYOUT é o do site ViaMob360 (mesmas classes do
// globals.css copiado de lá: hero, faixa-cards/cards8, section/section-head,
// two-col, panel, faq, cta, faixa-tripla, chat-painel); o CONTEÚDO vem do
// banco. Na página com banner:
// - a seção `numeros` logo depois do banner vira o quadro azul dele;
// - a 1ª seção `cards` (até 8 itens) sobe para logo abaixo do banner, como a
//   faixa de 8 cartões do ViaMob360.
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, ChevronRight, Clock, FileText, LayoutGrid, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useConfiguracao, useConteudo } from "@/components/public/AoVivo";
import Icone from "@/components/public/Icone";
import LinkSite from "@/components/public/LinkSite";
import Markdown from "@/components/public/Markdown";
import { linkWhatsapp } from "@/components/public/Footer";
import { ChatPainel } from "@/components/chat/ChatCentral";
import FormContato from "./FormContato";
import Download from "./Download";
import { ASSUNTOS_CONTATO_PADRAO, lerItens } from "@/lib/siteinstitucional/regrasSite";
import { soDigitos } from "@/lib/validacoes";
import type { Noticia, Secao, Solucao } from "@/types/conteudo";

export const dataBr = (ms: number) => (ms ? new Date(ms).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "");

// Cores dos círculos de ícone, na ordem dos 8 cartões do ViaMob360. O
// vermelho (cartão em destaque) fica só para o item que abre o chat.
const CORES = ["azul", "verde", "roxo", "azul", "verde", "laranja", "roxo", "cinza"];

// Fundo da seção → classes do ViaMob360 (section / section soft / section safety).
const classeSecao = (s: Secao) => `section${s.fundo === "suave" ? " soft" : s.fundo === "escuro" || s.fundo === "destaque" ? " safety" : ""}`;

function Cabecalho({ s }: { s: Pick<Secao, "chamada" | "titulo" | "tituloDestaque" | "texto"> }) {
  if (!s.chamada && !s.titulo && !s.texto) return null;
  return (
    <div className="section-head">
      <div>
        {s.chamada && <div className="eyebrow">{s.chamada}</div>}
        {s.titulo && <h2>{s.titulo}{s.tituloDestaque && <> <span className="destaque">{s.tituloDestaque}</span></>}</h2>}
      </div>
      {s.texto && <div className="texto-mut" style={{ maxWidth: 600 }}><Markdown>{s.texto}</Markdown></div>}
    </div>
  );
}

function Botoes({ s }: { s: Secao }) {
  if (!s.botaoTexto && !s.botao2Texto) return null;
  return (
    <div className="botoes">
      {s.botaoTexto && <LinkSite href={s.botaoLink} className="btn btn-primary">{s.botaoTexto} <ArrowRight size={18} /></LinkSite>}
      {s.botao2Texto && <LinkSite href={s.botao2Link} className="btn btn-outline">{s.botao2Texto}</LinkSite>}
    </div>
  );
}

// Cartão do ViaMob360 (.card8): círculo colorido, título, texto e "Saiba mais".
function Card8({ icone, cor, titulo, texto, href, saiba = "Saiba mais", topo }: {
  icone: string; cor: string; titulo: string; texto?: string; href?: string; saiba?: string; topo?: React.ReactNode;
}) {
  const corpo = (
    <>
      <span className={`icon-circ ${cor}`}><Icone nome={icone} tamanho={24} /></span>
      {topo}
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {href && <span className="saiba">{saiba} <ArrowRight size={15} /></span>}
    </>
  );
  const classe = `card8${cor === "vermelho" ? " destaque" : ""}`;
  return href ? <LinkSite href={href} className={classe}>{corpo}</LinkSite> : <div className={classe}>{corpo}</div>;
}

export function CartaoSolucao({ s, i = 0 }: { s: Solucao; i?: number }) {
  return (
    <Link href={`/solucoes/${s.slug}`} className="card8">
      <span className={`icon-circ ${CORES[i % CORES.length]}`} style={s.cor ? { background: s.cor } : undefined}><Icone nome={s.icone} tamanho={24} /></span>
      {s.categoria && <span className="tag">{s.categoria}</span>}
      <h3>{s.nome}</h3>
      {s.chamada && <strong className="chamada-card">{s.chamada}</strong>}
      <p>{s.resumo}</p>
      <span className="saiba">Conhecer <ArrowRight size={15} /></span>
    </Link>
  );
}

export function CartaoNoticia({ n }: { n: Noticia }) {
  return (
    <Link href={`/noticias/${n.slug}`} className="card card-noticia">
      {n.imagemUrl
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={n.imagemUrl} alt="" />
        : <span className="sem-img" aria-hidden><FileText size={34} /></span>}
      <div className="corpo">
        <small><CalendarDays size={14} /> {dataBr(n.data)}{n.categoria ? ` • ${n.categoria}` : ""}</small>
        <h3>{n.titulo}</h3>
        <p>{n.resumo}</p>
      </div>
    </Link>
  );
}

// ── Banner (hero) — marcação do ViaMob360 ────────────────────────────────
// Botão grande em duas linhas, como "Baixar App / para Passageiros":
// "Conheça | as soluções" ou, sem "|", quebra antes do 1º artigo/preposição.
function BotaoGrande({ href, texto, icone, classe }: { href: string; texto: string; icone: React.ReactNode; classe: string }) {
  let [linha1, ...resto] = texto.split(/\s*\|\s*/);
  if (!resto.length) {
    const p = linha1.split(/\s+/);
    const i = p.findIndex((w, k) => k > 0 && /^(a|o|as|os|um|uma|com|para|de|do|da|no|na|em)$/i.test(w));
    if (i > 0) { resto = [p.slice(i).join(" ")]; linha1 = p.slice(0, i).join(" "); }
  }
  return (
    <LinkSite href={href} className={`btn btn-grande ${classe}`}>
      {icone}<span><b>{linha1}</b>{resto.length > 0 && <small>{resto.join(" ")}</small>}</span><ChevronRight size={20} aria-hidden />
    </LinkSite>
  );
}

// Banner padrão da P2P Corp (public/images), usado enquanto a seção não tiver
// imagem cadastrada no admSite (Site → Seções → Banner principal).
const BANNER_PADRAO = "/images/banner-p2pcorp.jpg";

function Hero({ s, numeros }: { s: Secao; numeros?: Secao }) {
  const selos = lerItens(s.itens).slice(0, 4);
  const nums = numeros ? lerItens(numeros.itens) : [];
  const banner = s.imagemUrl || BANNER_PADRAO;
  const bannerMobile = banner;
  return (
    <section className="hero" id={s.ancora || "inicio"}>
      <div className="hero-bg" style={{ ["--banner" as any]: `url('${banner}')`, ["--banner-mobile" as any]: `url('${bannerMobile}')` }} />
      <div className="container hero-inner">
        <div className="hero-copy">
          {s.chamada && <div className="eyebrow">{s.chamada}</div>}
          <h1>{s.titulo}{s.tituloDestaque && <span className="g">{s.tituloDestaque}</span>}</h1>
          {s.texto && <Markdown>{s.texto}</Markdown>}
          {(s.botaoTexto || s.botao2Texto) && (
            <div className="hero-actions">
              {s.botaoTexto && <BotaoGrande href={s.botaoLink} texto={s.botaoTexto} classe="btn-primary" icone={<LayoutGrid size={30} aria-hidden />} />}
              {s.botao2Texto && <BotaoGrande href={s.botao2Link} texto={s.botao2Texto} classe="btn-outline-green" icone={<MessageCircle size={30} aria-hidden />} />}
            </div>
          )}
          {selos.length > 0 && (
            <div className="chips">
              {selos.map((i) => <span className="chip" key={i.titulo}><span className="chip-ic"><Icone nome={i.texto} tamanho={18} /></span>{i.titulo}</span>)}
            </div>
          )}
        </div>
        {nums.length > 0 && (
          <div className="hero-numeros">
            {nums.map((n) => (
              <div className="numero" key={n.titulo + n.texto}><span className="numero-ic"><Icone nome={n.icone} tamanho={22} /></span><div><strong>{n.titulo}</strong><span>{n.texto}</span></div></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Faixa de 8 cartões logo abaixo do banner (ViaMob360: .faixa-cards/.cards8).
function FaixaCards({ s }: { s: Secao }) {
  return (
    <section className="container faixa-cards" id={s.ancora || undefined}>
      <div className="cards8">
        {lerItens(s.itens).map((i, k) => <Card8 key={i.titulo} icone={i.icone} cor={i.link === "chat" ? "vermelho" : CORES[k % CORES.length]} titulo={i.titulo} texto={i.texto} href={i.link || undefined} />)}
      </div>
    </section>
  );
}

function Numeros({ s }: { s: Secao }) {
  const itens = lerItens(s.itens);
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container">
        <Cabecalho s={s} />
        <div className="grade-numeros">
          {itens.map((i, k) => (
            <div className="card" key={i.titulo + i.texto}>
              <span className={`icon-circ ${CORES[k % CORES.length]}`}><Icone nome={i.icone} /></span>
              <div><strong>{i.titulo}</strong><span>{i.texto}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cards({ s }: { s: Secao }) {
  const itens = lerItens(s.itens);
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container">
        <Cabecalho s={s} />
        <div className="cards8 auto">
          {itens.map((i, k) => <Card8 key={i.titulo} icone={i.icone} cor={i.link === "chat" ? "vermelho" : CORES[k % CORES.length]} titulo={i.titulo} texto={i.texto} href={i.link || undefined} />)}
        </div>
        <Botoes s={s} />
      </div>
    </section>
  );
}

function Solucoes({ s }: { s: Secao }) {
  const { solucoes } = useConteudo();
  const slugs = lerItens(s.itens).map((i) => i.titulo);
  const lista = slugs.length ? slugs.map((x) => solucoes.find((y) => y.slug === x)).filter((x): x is Solucao => !!x) : solucoes.filter((x) => x.destaqueHome);
  if (!lista.length) return null;
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container">
        <Cabecalho s={s} />
        <div className="cards8 auto">{lista.map((x, i) => <CartaoSolucao key={x.id} s={x} i={i} />)}</div>
        <Botoes s={s} />
      </div>
    </section>
  );
}

// Texto + imagem (ViaMob360: .two-col com .checks e o .panel ao lado).
function TextoImagem({ s }: { s: Secao }) {
  const itens = lerItens(s.itens);
  const texto = (
    <div>
      {s.chamada && <div className="eyebrow">{s.chamada}</div>}
      {s.titulo && <h2 className="h2-grande">{s.titulo}{s.tituloDestaque && <> <span className="destaque">{s.tituloDestaque}</span></>}</h2>}
      {s.texto && <div className="texto-mut"><Markdown>{s.texto}</Markdown></div>}
      {itens.length > 0 && <div className="checks">{itens.map((i) => <div className="check" key={i.titulo}><span className="dot">✓</span><span>{i.titulo}</span></div>)}</div>}
      <Botoes s={s} />
    </div>
  );
  const lado = s.imagemUrl
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={s.imagemUrl} alt="" className="imagem-secao" />
    : (
      <div className="panel">
        <div className="panel-head"><b>{s.chamada || s.titulo}</b><div className="panel-sub">Atendimento em tempo real</div></div>
        <div className="panel-body">
          <div className="bubble agent">Olá! Como posso ajudar?</div>
          <div className="bubble user">Quero acompanhar o meu pedido.</div>
          <div className="bubble agent">Claro! Já encontrei. Está em atendimento e o protocolo foi enviado por aqui. ✅</div>
        </div>
      </div>
    );
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container two-col">
        {s.imagemLado === "esquerda" ? <>{lado}{texto}</> : <>{texto}{lado}</>}
      </div>
    </section>
  );
}

function Texto({ s }: { s: Secao }) {
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container estreito">
        {s.chamada && <div className="eyebrow">{s.chamada}</div>}
        {s.titulo && <h2 className="h2-grande">{s.titulo}</h2>}
        <div className="markdown-body"><Markdown>{s.texto}</Markdown></div>
        <Botoes s={s} />
      </div>
    </section>
  );
}

function Parceiros({ s }: { s: Secao }) {
  const { parceiros } = useConteudo();
  const tipo = lerItens(s.itens)[0]?.titulo;
  const lista = tipo ? parceiros.filter((p) => p.tipo === tipo) : parceiros;
  if (!lista.length) return null;
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container">
        <Cabecalho s={s} />
        <div className="logos">
          {lista.map((p) => {
            const conteudo = p.logoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.logoUrl} alt={p.nome} title={p.nome} />
              : <span>{p.nome}</span>;
            return p.link ? <a key={p.id} href={p.link} target="_blank" rel="noreferrer" className="logo-item">{conteudo}</a> : <div key={p.id} className="logo-item">{conteudo}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

function Noticias({ s }: { s: Secao }) {
  const { noticias } = useConteudo();
  if (!noticias.length) return null;
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container">
        <Cabecalho s={s} />
        <div className="grade-noticias">{noticias.slice(0, 3).map((n) => <CartaoNoticia key={n.id} n={n} />)}</div>
        <Botoes s={s} />
      </div>
    </section>
  );
}

// Perguntas frequentes (ViaMob360: .busca-faq + .faq em duas colunas).
export function ListaFaq({ categoria, soDestaque }: { categoria?: string; soDestaque?: boolean }) {
  const { perguntas } = useConteudo();
  const [busca, setBusca] = useState("");
  const base = perguntas.filter((p) => (!categoria || p.categoria === categoria));
  const termo = busca.trim().toLowerCase();
  const lista = termo ? base.filter((p) => `${p.pergunta} ${p.resposta}`.toLowerCase().includes(termo)) : soDestaque ? base.filter((p) => p.destaqueHome) : base;
  if (!base.length) return null;
  return (
    <>
      <label className="busca-faq">
        <span className="sr">Buscar nas perguntas</span>
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por palavra-chave" />
      </label>
      <div className="faq">
        {lista.map((p, i) => <details key={p.id} open={i === 0 && !busca}><summary>{p.pergunta}</summary><div className="markdown-body"><Markdown>{p.resposta}</Markdown></div></details>)}
      </div>
      {lista.length === 0 && <div className="notice">Não achamos nada com “{busca}”. <LinkSite href="chat" className="link">Ainda precisa de ajuda? Fale com a gente pelo chat.</LinkSite></div>}
    </>
  );
}

function Faq({ s }: { s: Secao }) {
  const { perguntas } = useConteudo();
  if (!perguntas.length) return null;
  const categoria = lerItens(s.itens)[0]?.titulo;
  return (
    <section className={classeSecao(s)} id={s.ancora || undefined}>
      <div className="container">
        <Cabecalho s={s} />
        <ListaFaq categoria={categoria} soDestaque={s.pagina === "inicio"} />
      </div>
    </section>
  );
}

// Chamada final (ViaMob360: .cta claro com .cta-acoes).
function Cta({ s }: { s: Secao }) {
  const c = useConfiguracao();
  return (
    <section className="section" id={s.ancora || undefined}>
      <div className="container">
        <div className="cta">
          <div>
            <div className="eyebrow">{s.chamada || c.nomeSite}</div>
            {s.titulo && <h2>{s.titulo}</h2>}
            {s.texto && <div className="texto-mut"><Markdown>{s.texto}</Markdown></div>}
          </div>
          {(s.botaoTexto || s.botao2Texto) && (
            <div className="cta-acoes">
              {s.botaoTexto && <LinkSite href={s.botaoLink} className="btn btn-primary">{s.botaoTexto}</LinkSite>}
              {s.botao2Texto && <LinkSite href={s.botao2Link} className="btn btn-outline">{s.botao2Texto}</LinkSite>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Contato({ s }: { s: Secao }) {
  const c = useConfiguracao();
  const assuntos = lerItens(s.itens).map((i) => i.titulo);
  const zap = linkWhatsapp(c.whatsapp);
  return (
    <section className={classeSecao(s)} id={s.ancora || "contato"}>
      <div className="container two-col alinhado-topo">
        <div>
          {s.chamada && <div className="eyebrow">{s.chamada}</div>}
          {s.titulo && <h2 className="h2-grande">{s.titulo}</h2>}
          {s.texto && <div className="texto-mut"><Markdown>{s.texto}</Markdown></div>}
          <div className="contatos">
            {c.email && <a href={`mailto:${c.email}`} className="contato-item"><Mail size={20} /><div><small>E-mail</small><b>{c.email}</b></div></a>}
            {c.telefone && <a href={`tel:+55${soDigitos(c.telefone)}`} className="contato-item"><Phone size={20} /><div><small>Telefone</small><b>{c.telefone}</b></div></a>}
            {zap && <a href={zap} target="_blank" rel="noreferrer" className="contato-item"><MessageCircle size={20} /><div><small>WhatsApp</small><b>{c.whatsapp}</b></div></a>}
            {c.endereco && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.endereco)}`} target="_blank" rel="noreferrer" className="contato-item"><MapPin size={20} /><div><small>Endereço</small><b>{c.endereco}</b></div></a>}
            {c.horario && <div className="contato-item"><Clock size={20} /><div><small>Horário</small><b>{c.horario}</b></div></div>}
          </div>
        </div>
        <div className="card card-form"><FormContato assuntos={assuntos.length ? assuntos : ASSUNTOS_CONTATO_PADRAO} /></div>
      </div>
    </section>
  );
}

// Texto + chat embutido (ViaMob360: .faixa-tripla com .tripla-card e o painel).
function Chat({ s }: { s: Secao }) {
  return (
    <section className="container faixa-tripla" id={s.ancora || undefined}>
      <div className="tripla-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="bloco-texto">
          {s.chamada && <span className="tag">{s.chamada}</span>}
          {s.titulo && <h2>{s.titulo}</h2>}
          {s.texto && <Markdown>{s.texto}</Markdown>}
          <Botoes s={s} />
        </div>
      </div>
      <ChatPainel />
    </section>
  );
}

const BLOCOS: Record<Secao["tipo"], (p: { s: Secao }) => React.ReactNode> = {
  hero: Hero, numeros: Numeros, cards: Cards, solucoes: Solucoes, texto_imagem: TextoImagem, texto: Texto,
  parceiros: Parceiros, noticias: Noticias, faq: Faq, cta: Cta, contato: Contato, chat: Chat, download: Download,
};

export default function Secoes({ pagina, inicial }: { pagina: string; inicial?: Secao[] }) {
  const { secoes } = useConteudo();
  const lista = secoes.filter((s) => s.pagina === pagina);
  const usar = lista.length || !inicial ? lista : inicial;
  const iHero = usar.findIndex((s) => s.tipo === "hero");
  const numerosDoHero = iHero >= 0 && usar[iHero + 1]?.tipo === "numeros" ? usar[iHero + 1] : undefined;
  const faixa = iHero >= 0 ? usar.find((s) => s.tipo === "cards" && lerItens(s.itens).length <= 8) : undefined;
  return (
    <>
      {usar.map((s) => {
        if (s === numerosDoHero || s === faixa) return null;
        if (s.tipo === "hero") return <div key={s.id}><Hero s={s} numeros={numerosDoHero} />{faixa && <FaixaCards s={faixa} />}</div>;
        const B = BLOCOS[s.tipo]; return <B key={s.id} s={s} />;
      })}
    </>
  );
}
