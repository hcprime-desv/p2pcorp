"use client";

// Formulário de contato (seção "contato") → leads_site. Os assuntos vêm dos
// "itens" da seção (um por linha) ou dos padrões de regrasSite.
import Link from "next/link";
import { useState } from "react";
import { enviarLead, LEAD_VAZIO, validarLead, type DadosLead } from "@/lib/leads";
import { mascarar } from "@/lib/validacoes";
import { useConteudo } from "@/components/public/AoVivo";

export default function FormContato({ assuntos, solucaoInicial = "" }: { assuntos: string[]; solucaoInicial?: string }) {
  const { solucoes, configuracao } = useConteudo();
  const [d, setD] = useState<DadosLead>({ ...LEAD_VAZIO, assunto: assuntos[0] ?? "", solucao: solucaoInicial });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [falha, setFalha] = useState("");
  const muda = (campo: keyof DadosLead, valor: any) => setD((x) => ({ ...x, [campo]: valor }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = validarLead(d);
    setErros(p);
    if (Object.keys(p).length) return;
    setEnviando(true); setFalha("");
    try { setProtocolo(await enviarLead(d, typeof location !== "undefined" ? location.pathname : "")); }
    catch (err) { console.error("[site] lead", err); setFalha("Não foi possível enviar agora. Tente de novo em instantes."); }
    finally { setEnviando(false); }
  };

  if (protocolo) {
    return (
      <div className="form-ok">
        <div className="ok-circulo">✓</div>
        <h3>Recebemos a sua mensagem!</h3>
        <p>Número do registro: <b>{protocolo}</b>. A equipe {configuracao.nomeSite} vai falar com você em breve.</p>
        <button type="button" className="btn btn-outline" onClick={() => { setProtocolo(null); setD({ ...LEAD_VAZIO, assunto: assuntos[0] ?? "" }); }}>Enviar outra mensagem</button>
      </div>
    );
  }

  const campo = (nome: keyof DadosLead, rotulo: string, extra: { tipo?: string; mascara?: "telefone"; largo?: boolean; auto?: string } = {}) => (
    <label className={`campo${extra.largo ? " largo" : ""}`}>
      <span>{rotulo}</span>
      <input type={extra.tipo ?? "text"} value={String(d[nome] ?? "")} autoComplete={extra.auto}
        onChange={(e) => muda(nome, extra.mascara ? mascarar(extra.mascara, e.target.value) : e.target.value)} aria-invalid={!!erros[nome]} />
      {erros[nome] && <em>{erros[nome]}</em>}
    </label>
  );

  return (
    <form className="form-contato" onSubmit={enviar} noValidate>
      <div className="grade-form">
        {campo("nome", "Nome *", { largo: true, auto: "name" })}
        {campo("email", "E-mail", { tipo: "email", auto: "email" })}
        {campo("telefone", "Telefone / WhatsApp", { mascara: "telefone", auto: "tel" })}
        {campo("organizacao", "Órgão ou empresa", { auto: "organization" })}
        {campo("cargo", "Cargo")}
        <label className="campo">
          <span>Assunto</span>
          <select value={d.assunto} onChange={(e) => muda("assunto", e.target.value)}>{assuntos.map((a) => <option key={a}>{a}</option>)}</select>
        </label>
        {solucoes.length > 0 && (
          <label className="campo">
            <span>Solução de interesse</span>
            <select value={d.solucao} onChange={(e) => muda("solucao", e.target.value)}>
              <option value="">— Escolha (opcional) —</option>
              {solucoes.map((s) => <option key={s.id} value={s.nome}>{s.nome}</option>)}
            </select>
          </label>
        )}
        <label className="campo largo">
          <span>Mensagem *</span>
          <textarea rows={4} value={d.mensagem} onChange={(e) => muda("mensagem", e.target.value)} aria-invalid={!!erros.mensagem} />
          {erros.mensagem && <em>{erros.mensagem}</em>}
        </label>
        <label className="aceite largo">
          <input type="checkbox" checked={d.aceite} onChange={(e) => muda("aceite", e.target.checked)} />
          <span>Concordo com a <Link href="/politica-de-privacidade" target="_blank">Política de Privacidade</Link> e autorizo o contato da equipe {configuracao.nomeSite}.</span>
        </label>
        {erros.aceite && <em className="largo erro">{erros.aceite}</em>}
      </div>
      {falha && <div className="chat-erro" role="alert">{falha}</div>}
      <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? "Enviando..." : "Enviar mensagem"}</button>
    </form>
  );
}
