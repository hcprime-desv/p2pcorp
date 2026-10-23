"use client";

// Tema claro/escuro do site — configurado no admSite (Configuração do site →
// "Tema do site": claro, escuro ou automático = segue o aparelho) e, com
// "Mostrar botão claro/escuro", o visitante troca no topo (a escolha fica no
// navegador dele, em localStorage). O tema vai em <html data-tema="...">; as
// cores do escuro estão no fim do app/globals.css.
import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useConfiguracao } from "./AoVivo";
import type { TemaSite } from "@/lib/siteinstitucional/regrasSite";
import { CHAVE_TEMA as CHAVE } from "@/lib/tema";

type Efetivo = "claro" | "escuro";

function ler(): string | null { try { return localStorage.getItem(CHAVE); } catch { return null; } }
function gravar(v: Efetivo) { try { localStorage.setItem(CHAVE, v); } catch { /* navegador sem storage */ } }

function calcular(tema: TemaSite, botao: boolean): Efetivo {
  const escolhido = botao ? ler() : null;
  if (escolhido === "claro" || escolhido === "escuro") return escolhido;
  if (tema === "automatico") return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
  return tema;
}

export function useTema() {
  const c = useConfiguracao();
  const [atual, setAtual] = useState<Efetivo>("claro");
  // Recalcula quando o admSite muda a configuração (ao vivo) e, no
  // automático, quando o aparelho troca de claro para escuro.
  useEffect(() => {
    const aplicar = () => { const t = calcular(c.tema, c.temaBotao); document.documentElement.setAttribute("data-tema", t); setAtual(t); };
    aplicar();
    if (c.tema !== "automatico") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, [c.tema, c.temaBotao]);
  const alternar = useCallback(() => {
    const t: Efetivo = atual === "escuro" ? "claro" : "escuro";
    gravar(t);
    document.documentElement.setAttribute("data-tema", t);
    setAtual(t);
  }, [atual]);
  return { escuro: atual === "escuro", alternar, botao: c.temaBotao };
}

// Botão do topo (sol/lua), no mesmo estilo da busca do ViaMob360 (.busca).
export function BotaoTema() {
  const { escuro, alternar, botao } = useTema();
  if (!botao) return null;
  return (
    <button type="button" className="busca botao-tema" onClick={alternar} aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"} title={escuro ? "Tema claro" : "Tema escuro"}>
      {escuro ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

// Sem botão, o tema ainda precisa acompanhar a configuração ao vivo.
export function AplicarTema() {
  useTema();
  return null;
}
