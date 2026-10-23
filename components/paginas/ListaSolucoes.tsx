"use client";

// /solucoes — todas as soluções publicadas, com filtro por categoria (área)
// e busca. Categorias = as que existem no cadastro (admSite → Site → Soluções).
// Layout do ViaMob360 (filtro em pílulas .cidade, busca .busca-faq, .cards8).
import { useState } from "react";
import { useConteudo } from "@/components/public/AoVivo";
import { CartaoSolucao } from "@/components/secoes/Secoes";
import { CabecalhoPagina } from "./PaginaDinamica";
import Secoes from "@/components/secoes/Secoes";

export default function ListaSolucoes() {
  const { solucoes, secoes } = useConteudo();
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const categorias = [...new Set(solucoes.map((s) => s.categoria))];
  const termo = busca.trim().toLowerCase();
  const lista = solucoes.filter((s) => (!categoria || s.categoria === categoria)
    && (!termo || `${s.nome} ${s.chamada} ${s.resumo} ${s.publico.join(" ")} ${s.recursos.join(" ")}`.toLowerCase().includes(termo)));
  return (
    <>
      <CabecalhoPagina chamada="Portfólio" titulo="Soluções" resumo="Encontre a solução certa para o seu órgão ou a sua empresa." />
      <section className="section">
        <div className="container">
          <div className="filtros">
            <div className="cidades" role="group" aria-label="Filtrar por área">
              <button type="button" className={`cidade${!categoria ? " ativa" : ""}`} onClick={() => setCategoria("")}>Todas</button>
              {categorias.map((c) => <button type="button" key={c} className={`cidade${categoria === c ? " ativa" : ""}`} onClick={() => setCategoria(c)}>{c}</button>)}
            </div>
            <label className="busca-faq">
              <span className="sr">Buscar solução</span>
              <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar (ex.: escola, WhatsApp, frota)" />
            </label>
          </div>
          <div className="cards8 auto">{lista.map((s, i) => <CartaoSolucao key={s.id} s={s} i={i} />)}</div>
          {lista.length === 0 && <div className="notice">Nenhuma solução encontrada.</div>}
        </div>
      </section>
      {secoes.some((s) => s.pagina === "solucoes") && <Secoes pagina="solucoes" />}
    </>
  );
}
