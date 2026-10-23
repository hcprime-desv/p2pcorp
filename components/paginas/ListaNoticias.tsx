"use client";

import { useState } from "react";
import { useConteudo } from "@/components/public/AoVivo";
import { CartaoNoticia } from "@/components/secoes/Secoes";
import { CabecalhoPagina } from "./PaginaDinamica";

// /noticias — notícias publicadas (admSite → Site → Notícias), mais novas primeiro.
const POR_PAGINA = 9;

export default function ListaNoticias() {
  const { noticias } = useConteudo();
  const [qtd, setQtd] = useState(POR_PAGINA);
  return (
    <>
      <CabecalhoPagina chamada="Novidades" titulo="Notícias" />
      <section className="section">
        <div className="container">
          <div className="grade-noticias">{noticias.slice(0, qtd).map((n) => <CartaoNoticia key={n.id} n={n} />)}</div>
          {noticias.length === 0 && <div className="notice">Nenhuma notícia publicada ainda.</div>}
          {noticias.length > qtd && <div className="centro"><button type="button" className="btn btn-outline" onClick={() => setQtd((q) => q + POR_PAGINA)}>Carregar mais</button></div>}
        </div>
      </section>
    </>
  );
}
