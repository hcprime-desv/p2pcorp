"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { subscribeConteudo } from "@/lib/data";
import type { Conteudo } from "@/types/conteudo";

// Dados ao vivo do site (padrão ViaMob360): o servidor manda o conteúdo
// atual no HTML e, no navegador, listeners (onSnapshot) mantêm tudo
// sincronizado com o admSite — editou lá, muda na tela.
const Contexto = createContext<Conteudo | null>(null);

export function AoVivoProvider({ inicial, children }: { inicial: Conteudo; children: React.ReactNode }) {
  const [c, setC] = useState(inicial);
  useEffect(() => subscribeConteudo(setC), []);
  // Cores da Configuração do site sobrescrevem as variáveis do globals.css.
  const k = c.configuracao;
  const tema = { ["--cor" as any]: k.corPrimaria, ["--destaque" as any]: k.corDestaque, ["--escura" as any]: k.corEscura } as React.CSSProperties;
  return (
    <Contexto.Provider value={c}>
      <div style={tema} className="tema">{children}</div>
    </Contexto.Provider>
  );
}

export function useConteudo(): Conteudo {
  const e = useContext(Contexto);
  if (!e) throw new Error("useConteudo fora do AoVivoProvider (app/(public)/layout.tsx).");
  return e;
}
export const useConfiguracao = () => useConteudo().configuracao;
