// Tema claro/escuro (servidor e navegador). Ver components/public/Tema.tsx.
import type { TemaSite } from "@/lib/siteinstitucional/regrasSite";

export const CHAVE_TEMA = "tema-site"; // escolha do visitante (localStorage)

// Script do <head> (app/layout.tsx): aplica o tema ANTES de pintar a página,
// para não piscar claro antes de escurecer.
export function scriptTema(tema: TemaSite, botao: boolean): string {
  return `(function(){try{var t=${JSON.stringify(tema)},e=${botao ? `localStorage.getItem(${JSON.stringify(CHAVE_TEMA)})` : "null"};`
    + `if(e!=="claro"&&e!=="escuro")e=t==="automatico"?(matchMedia("(prefers-color-scheme: dark)").matches?"escuro":"claro"):t;`
    + `document.documentElement.setAttribute("data-tema",e)}catch(_){}})();`;
}
