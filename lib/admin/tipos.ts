// CÓPIA gerada por scripts/copiar-admin-site.py — NÃO edite aqui: altere em packages/layout/src/sites/admin e copie de novo.
// /admin dos SITES — tipos do kit (fonte única no monorepo: packages/layout/src/sites/admin; copiado para cada site por
// `python scripts/copiar-admin-site.py <site>`). O site descreve o PRÓPRIO /admin em lib/admin/site.tsx (SITE_ADMIN).
import type { ReactNode } from "react";

export type Opcao = { valor: string; rotulo: string };

export type Campo = {
  nome: string;
  rotulo: string;
  tipo:
    | "texto" | "textarea" | "markdown" | "numero" | "select" | "check" | "imagem" | "cor" | "email" | "senha" | "permissoes"
    | "lista"      // separada por vírgula → array
    | "linhas"     // uma por linha → array
    | "data"       // dd/mm/aaaa (texto)
    | "dataiso"    // AAAA-MM-DD (texto, calendário)
    | "datahora";  // milissegundos (número)
  obrigatorio?: boolean;
  dica?: string;
  placeholder?: string;
  largura?: 1 | 2 | 3; // colunas da grade (3 = linha inteira)
  opcoes?: Opcao[];
  /** Opções lidas de outra coleção (ao vivo) */
  fonte?: { colecao: string; rotulo: string; filtro?: (d: any) => boolean };
  padrao?: any;
};

export type Coluna = { campo: string; rotulo: string; tipo?: "check" | "imagem" | "selo" | "ref" | "lista" | "opcao" | "datahora" };

export type Cadastro = {
  /** rota: /admin/<id> */
  id: string;
  titulo: string;
  singular: string;
  colecao: string;
  permissao: string;
  descricao?: string;
  campos: Campo[];
  colunas: Coluna[];
  /** campo que identifica o registro (exclusão, auditoria) */
  rotulo: string;
  ordenar?: (a: any, b: any) => number;
  /** registro ÚNICO (ex.: configuração do site): abre direto o formulário do primeiro (ou cria) */
  unico?: boolean;
  /** só consulta e edição (sem "Novo"), ex.: interessados que chegam pelo site */
  semNovo?: boolean;
  /** ajuste final antes de gravar (ou mensagem de erro) */
  preparar?: (dados: Record<string, any>, original: Record<string, any> | null) => Promise<Record<string, any> | string>;
};

export type ItemMenu = { href: string; rotulo: string; permissao: string; icone: ReactNode };

export type SiteAdmin = {
  /** nome no título da aba e no login */
  nome: string;
  logo: string;
  logoBranco: string;
  /** chave da sessão no navegador (uma por site) */
  chaveSessao: string;
  /** `modulo` da trilha de auditoria */
  modulo: string;
  /** chave de permissão → rótulo (tela Grupos) */
  permissoes: Record<string, string>;
  /** perfil do usuário → permissões que ele tem sem grupo ("*" = tudo). administrador e nível 99 = tudo. */
  perfis: Record<string, string[] | "*">;
  menu: { grupo: string; itens: ItemMenu[] }[];
  cadastros: Cadastro[];
};
