"use client";

// /solucoes/{slug} — página da solução: chamada, resumo, para quem, recursos,
// plataformas, conteúdo livre (Markdown), seções extras (pagina =
// "solucao-{slug}") e o formulário de proposta já com a solução marcada.
// Layout do ViaMob360 (.pagina-cab, .two-col, .card, .checks).
import Link from "next/link";
import { ArrowLeft, ArrowRight, Monitor } from "lucide-react";
import { useConteudo } from "@/components/public/AoVivo";
import Icone from "@/components/public/Icone";
import Markdown from "@/components/public/Markdown";
import LinkSite from "@/components/public/LinkSite";
import Secoes, { CartaoSolucao } from "@/components/secoes/Secoes";
import FormContato from "@/components/secoes/FormContato";
import { CabecalhoPagina } from "./PaginaDinamica";
import { ASSUNTOS_CONTATO_PADRAO } from "@/lib/siteinstitucional/regrasSite";

export default function DetalheSolucao({ slug }: { slug: string }) {
  const { solucoes } = useConteudo();
  const s = solucoes.find((x) => x.slug === slug);
  if (!s) return <div className="container vazio">Esta solução não está mais publicada.</div>;
  const outras = solucoes.filter((x) => x.slug !== slug && x.categoria === s.categoria).concat(solucoes.filter((x) => x.slug !== slug && x.categoria !== s.categoria)).slice(0, 4);
  return (
    <>
      <CabecalhoPagina titulo="" imagemUrl={s.imagemUrl}>
        <Link href="/solucoes" className="voltar"><ArrowLeft size={16} /> Todas as soluções</Link>
        <div className="solucao-titulo">
          <span className="icon-circ grande azul" style={s.cor ? { background: s.cor } : undefined}><Icone nome={s.icone} tamanho={30} /></span>
          <div><div className="eyebrow">{s.categoria}</div><h1>{s.nome}</h1></div>
        </div>
        {s.chamada && <p className="solucao-chamada">{s.chamada}</p>}
        <p>{s.resumo}</p>
        <div className="botoes">
          <a href="#proposta" className="btn btn-primary">Pedir proposta <ArrowRight size={18} /></a>
          <LinkSite href="chat" className="btn btn-outline">Falar no chat</LinkSite>
          {s.linkExterno && <LinkSite href={s.linkExterno} className="btn btn-outline">Site da solução</LinkSite>}
        </div>
      </CabecalhoPagina>

      <section className="section">
        <div className="container solucao-grade">
          <div>
            {s.conteudo && <div className="markdown-body"><Markdown>{s.conteudo}</Markdown></div>}
            {s.recursos.length > 0 && (
              <>
                <h2 className="h2-grande">Recursos</h2>
                <div className="checks">{s.recursos.map((r) => <div className="check" key={r}><span className="dot">✓</span><span>{r}</span></div>)}</div>
              </>
            )}
          </div>
          <aside className="card solucao-lado">
            {s.publico.length > 0 && (<><h3>Para quem</h3><ul>{s.publico.map((p) => <li key={p}>{p}</li>)}</ul></>)}
            {s.plataformas.length > 0 && (<><h3>Plataformas</h3><div className="plataformas">{s.plataformas.map((p) => <span key={p} className="tag"><Monitor size={12} /> {p}</span>)}</div></>)}
          </aside>
        </div>
      </section>

      <Secoes pagina={`solucao-${s.slug}`} />

      <section className="section soft" id="proposta">
        <div className="container two-col alinhado-topo">
          <div>
            <div className="eyebrow">Proposta</div>
            <h2 className="h2-grande">Quer o {s.nome} no seu órgão ou empresa?</h2>
            <p className="texto-mut">Conte o seu cenário: montamos uma demonstração e uma proposta sob medida.</p>
          </div>
          <div className="card card-form"><FormContato assuntos={ASSUNTOS_CONTATO_PADRAO} solucaoInicial={s.nome} /></div>
        </div>
      </section>

      {outras.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><div><div className="eyebrow">Veja também</div><h2>Outras soluções</h2></div></div>
            <div className="cards8 auto">{outras.map((x, i) => <CartaoSolucao key={x.id} s={x} i={i} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
