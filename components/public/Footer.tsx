"use client";

// Rodapé no layout do site ViaMob360 (footer-grid/footer-marca/footer-fim):
// logo branco + texto + redes, colunas do menu (itens com local "rodape" ou
// "ambos", uma coluna por GRUPO; sem grupo = "Institucional"), Soluções e
// Contato, e a linha final com razão social e CNPJ. Tudo da Configuração e
// do Menu (admSite).
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useConfiguracao, useConteudo } from "./AoVivo";
import { LinkMenu, LogoMarca } from "./Header";
import { soDigitos } from "@/lib/validacoes";

const ICONES = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin, youtube: Youtube };

export const linkWhatsapp = (numero: string) => { const d = soDigitos(numero); return d ? `https://wa.me/${d.startsWith("55") ? d : "55" + d}` : ""; };

export default function Footer() {
  const c = useConfiguracao();
  const { menu, solucoes } = useConteudo();
  const doRodape = menu.filter((m) => m.local !== "menu");
  const colunas = new Map<string, typeof doRodape>();
  doRodape.forEach((m) => { const g = m.grupo || "Institucional"; if (!colunas.has(g)) colunas.set(g, []); colunas.get(g)!.push(m); });
  const zap = linkWhatsapp(c.whatsapp);
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-marca">
            <LogoMarca branco />
            {c.textoRodape && <p>{c.textoRodape}</p>}
            {c.redes.length > 0 && (
              <div className="redes">
                {c.redes.map((r) => { const I = ICONES[r.rede]; return <a key={r.rede} href={r.url} target="_blank" rel="noreferrer" aria-label={r.rede}><I size={20} /></a>; })}
              </div>
            )}
          </div>
          {[...colunas.entries()].slice(0, 3).map(([nome, itens]) => (
            <div key={nome}><h4>{nome}</h4>{itens.map((i) => <LinkMenu key={i.id} item={i} />)}</div>
          ))}
          {solucoes.length > 0 && (
            <div><h4>Soluções</h4>{solucoes.slice(0, 6).map((s) => <a key={s.id} href={`/solucoes/${s.slug}`}>{s.nome}</a>)}</div>
          )}
          <div>
            <h4>Contato</h4>
            {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
            {c.telefone && <a href={`tel:+55${soDigitos(c.telefone)}`}>{c.telefone}</a>}
            {zap && <a href={zap} target="_blank" rel="noreferrer">WhatsApp</a>}
            {c.endereco && <p>{c.endereco}</p>}
          </div>
        </div>
        <div className="footer-fim">
          <div className="copy">
            <span>© {new Date().getFullYear()} {c.copyright}. Todos os direitos reservados.</span>
            {(c.razaoSocial || c.cnpj) && <span>{[c.razaoSocial, c.cnpj && `CNPJ ${c.cnpj}`].filter(Boolean).join(" • ")}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
