"use client";

// Seção "download" (dono, 28/10/2026 — "Baixar o AppBuilder" no site): programa para baixar + PEDIDO DE CHAVE DE
// TESTE. A 1ª linha dos itens = código do programa (ex.: appbuilder); as outras = passos extras.
//  - Versão, link (Firebase Storage), tamanho e SHA-256 vêm ao vivo de sites/{empresa}/downloads_site/{codigo},
//    gravado pelo script de publicação do programa (AppBuilder: npm run publicar:instalador) — versão nova no ar sem
//    mexer no site. Cada clique em Baixar soma 1 em `downloads`.
//  - "Peça a sua chave de teste" → leads_site com tipo "chave_teste" (admSite → Site → Interessados); a equipe gera a
//    chave no AppBuilder (Licenças) e envia.
import Link from "next/link";
import { useEffect, useState } from "react";
import { increment } from "firebase/firestore";
import { CheckCircle2, Download as IconeDownload, KeyRound, MonitorDown, ShieldCheck } from "lucide-react";
import { useConfiguracao } from "@/components/public/AoVivo";
import Markdown from "@/components/public/Markdown";
import { criarComIdSequencial, getDocOn, gravarComId } from "@/lib/firebase/gen";
import { COLECOES_SITE, lerItens } from "@/lib/siteinstitucional/regrasSite";
import { emailValido, mascarar, telefoneValido } from "@/lib/validacoes";
import type { Secao } from "@/types/conteudo";

type Programa = { nome?: string; versao?: string; arquivo_url?: string; arquivo_nome?: string; tamanho?: number; sha256?: string; publicado_em?: string; notas?: string; requisitos?: string; downloads?: number };
const mb = (b?: number) => (b ? `${Math.round(b / 1024 / 1024)} MB` : "");
const dataBr = (v?: string) => (v ? new Date(v).toLocaleDateString("pt-BR") : "");

function PedidoChave({ programa, codigo }: { programa: string; codigo: string }) {
  const c = useConfiguracao();
  const [d, setD] = useState({ nome: "", email: "", telefone: "", organizacao: "", mensagem: "", aceite: false });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [falha, setFalha] = useState("");
  const muda = (k: keyof typeof d, v: any) => setD((x) => ({ ...x, [k]: v }));
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (d.nome.trim().length < 3) er.nome = "Informe o seu nome.";
    if (!emailValido(d.email)) er.email = "Informe um e-mail válido (a chave vai para ele).";
    if (d.telefone.trim() && !telefoneValido(d.telefone)) er.telefone = "Telefone inválido.";
    if (d.organizacao.trim().length < 2) er.organizacao = "Informe a empresa (vira o nome do seu espaço de teste).";
    if (!d.aceite) er.aceite = "É preciso concordar com a Política de Privacidade.";
    setErros(er);
    if (Object.keys(er).length) return;
    setEnviando(true); setFalha("");
    try {
      setProtocolo(await criarComIdSequencial(COLECOES_SITE.leads, {
        tipo: "chave_teste", nome: d.nome.trim(), email: d.email.trim().toLowerCase(), telefone: d.telefone.replace(/\D/g, ""), organizacao: d.organizacao.trim(), cargo: "",
        assunto: `Chave de teste — ${programa}`, solucao: programa, programa: codigo, mensagem: d.mensagem.trim() || `Quero testar o ${programa}.`,
        aceite_lgpd: true, aceite_em: Date.now(), origem: typeof location !== "undefined" ? location.pathname : "", status: "novo",
      }));
    } catch (err) { console.error("[site] pedido de chave", err); setFalha("Não foi possível enviar agora. Tente de novo em instantes."); }
    finally { setEnviando(false); }
  };
  if (protocolo) return (
    <div className="form-ok">
      <div className="ok-circulo">✓</div>
      <h3>Pedido recebido!</h3>
      <p>Número do registro: <b>{protocolo}</b>. A equipe {c.nomeSite} vai enviar a sua <b>chave de teste</b> para <b>{d.email}</b> em breve.</p>
    </div>
  );
  const campo = (k: "nome" | "email" | "telefone" | "organizacao", rotulo: string, extra: { tipo?: string; mascara?: "telefone"; largo?: boolean; auto?: string } = {}) => (
    <label className={`campo${extra.largo ? " largo" : ""}`}>
      <span>{rotulo}</span>
      <input type={extra.tipo ?? "text"} value={d[k]} autoComplete={extra.auto} aria-invalid={!!erros[k]}
        onChange={(e) => muda(k, extra.mascara ? mascarar(extra.mascara, e.target.value) : e.target.value)} />
      {erros[k] && <em>{erros[k]}</em>}
    </label>
  );
  return (
    <form className="form-contato" onSubmit={enviar} noValidate>
      <h3 className="download-form-titulo"><KeyRound size={20} /> Peça a sua chave de teste grátis</h3>
      <div className="grade-form">
        {campo("nome", "Nome *", { largo: true, auto: "name" })}
        {campo("email", "E-mail * (a chave vai para ele)", { tipo: "email", auto: "email" })}
        {campo("telefone", "Telefone / WhatsApp", { mascara: "telefone", auto: "tel" })}
        {campo("organizacao", "Empresa *", { largo: true, auto: "organization" })}
        <label className="campo largo">
          <span>O que você quer criar? (opcional)</span>
          <textarea rows={3} value={d.mensagem} onChange={(e) => muda("mensagem", e.target.value)} />
        </label>
        <label className="aceite largo">
          <input type="checkbox" checked={d.aceite} onChange={(e) => muda("aceite", e.target.checked)} />
          <span>Concordo com a <Link href="/politica-de-privacidade" target="_blank">Política de Privacidade</Link> e autorizo o contato da equipe {c.nomeSite}.</span>
        </label>
        {erros.aceite && <em className="largo erro">{erros.aceite}</em>}
      </div>
      {falha && <div className="chat-erro" role="alert">{falha}</div>}
      <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? "Enviando..." : "Quero a minha chave"}</button>
    </form>
  );
}

export default function Download({ s }: { s: Secao }) {
  const itens = lerItens(s.itens).map((i) => i.titulo).filter(Boolean);
  const codigo = (itens[0] || "appbuilder").trim().toLowerCase();
  const passosExtras = itens.slice(1);
  const [p, setP] = useState<Programa | null | undefined>(undefined);
  useEffect(() => getDocOn(COLECOES_SITE.downloads, codigo, setP), [codigo]);
  const nome = p?.nome || "AppBuilder";
  const baixar = () => { void gravarComId(COLECOES_SITE.downloads, codigo, { downloads: increment(1) }, true).catch(() => {}); };
  const passos = [
    `Clique em **Baixar** e salve o instalador.`,
    `Abra o arquivo. Se aparecer *"O Windows protegeu o computador"*, clique em **Mais informações → Executar assim mesmo** (o instalador ainda não tem assinatura digital).`,
    ...passosExtras,
    `Na primeira abertura, digite a **chave de ativação** e crie o seu usuário e senha — o seu espaço de teste já vem com exemplos para começar.`,
  ];
  return (
    <section className={`section${s.fundo === "suave" ? " soft" : ""}`} id={s.ancora || "download"}>
      <div className="container two-col alinhado-topo">
        <div>
          {s.chamada && <div className="eyebrow">{s.chamada}</div>}
          <h2 className="h2-grande">{s.titulo || `Baixe o ${nome}`}</h2>
          {s.texto && <div className="texto-mut"><Markdown>{s.texto}</Markdown></div>}
          <div className="card download-card">
            {p === undefined ? <p className="texto-mut">Carregando…</p> : !p?.arquivo_url ? <p className="texto-mut">O instalador ainda não foi publicado. Peça a sua chave ao lado — avisamos quando estiver disponível.</p> : (
              <>
                <div className="download-topo">
                  <MonitorDown size={34} />
                  <div><b>{nome} para Windows</b><small>Versão {p.versao}{p.tamanho ? ` · ${mb(p.tamanho)}` : ""}{p.publicado_em ? ` · ${dataBr(p.publicado_em)}` : ""}</small></div>
                </div>
                <a className="btn btn-primary download-botao" href={p.arquivo_url} onClick={baixar} rel="noreferrer">
                  <IconeDownload size={18} /> Baixar o {nome} {p.versao}
                </a>
                <ul className="download-req">
                  <li><CheckCircle2 size={16} /> {p.requisitos || "Windows 10 ou 11 (64 bits) e internet"}</li>
                  <li><KeyRound size={16} /> Precisa de uma chave de ativação (teste grátis ou contratada)</li>
                  {p.sha256 && <li title="Impressão digital do arquivo — confere que ele não foi alterado"><ShieldCheck size={16} /> SHA-256: <code className="download-hash">{p.sha256}</code></li>}
                </ul>
                {p.notas && <div className="texto-mut download-notas"><Markdown>{p.notas}</Markdown></div>}
              </>
            )}
          </div>
          <ol className="download-passos">{passos.map((t, i) => <li key={i}><Markdown>{t}</Markdown></li>)}</ol>
        </div>
        <div className="card card-form"><PedidoChave programa={nome} codigo={codigo} /></div>
      </div>
    </section>
  );
}
