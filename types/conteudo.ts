// Formas que o site usa — espelham os schemas do hcCore
// (shared/shemas/siteinstitucional/*), já normalizadas por lib/data.ts.
import type { FundoSecao, TemaSite, TipoMenu, TipoSecao } from "@/lib/siteinstitucional/regrasSite";

export type Rede = { rede: "instagram" | "facebook" | "linkedin" | "youtube"; url: string };

export type Configuracao = {
  nomeSite: string; slogan: string; logoUrl: string | null; logoRodapeUrl: string | null; faviconUrl: string | null;
  corPrimaria: string; corDestaque: string; corEscura: string; tema: TemaSite; temaBotao: boolean;
  razaoSocial: string; cnpj: string; email: string; telefone: string; whatsapp: string; endereco: string; horario: string;
  redes: Rede[]; textoRodape: string; copyright: string; seoTitulo: string; seoDescricao: string;
  botaoTopoTexto: string; botaoTopoLink: string;
  chatAtivo: boolean; chatTitulo: string; chatSaudacao: string; chatAssuntos: string[]; chatPerguntaNome: string;
};

export type ItemMenu = { id: string; rotulo: string; tipo: TipoMenu; destino: string; grupo: string; local: "menu" | "rodape" | "ambos"; ordem: number; novaAba: boolean };

export type Secao = {
  id: string; pagina: string; tipo: TipoSecao; ancora: string; chamada: string; titulo: string; tituloDestaque: string; texto: string; itens: string;
  imagemUrl: string | null; imagemLado: "esquerda" | "direita"; botaoTexto: string; botaoLink: string; botao2Texto: string; botao2Link: string;
  fundo: FundoSecao; ordem: number;
};

export type Pagina = { id: string; titulo: string; slug: string; resumo: string; conteudo: string; imagemUrl: string | null; seoDescricao: string; ordem: number };

export type Solucao = {
  id: string; nome: string; slug: string; categoria: string; chamada: string; resumo: string; conteudo: string;
  publico: string[]; recursos: string[]; plataformas: string[]; icone: string; cor: string; imagemUrl: string | null;
  linkExterno: string; destaqueHome: boolean; ordem: number;
};

export type Noticia = { id: string; titulo: string; slug: string; resumo: string; conteudo: string; imagemUrl: string | null; data: number; categoria: string; destaque: boolean };

export type Parceiro = { id: string; nome: string; logoUrl: string | null; link: string; tipo: string; ordem: number };

export type Pergunta = { id: string; pergunta: string; resposta: string; categoria: string; destaqueHome: boolean; ordem: number };

export type Aviso = { id: string; versao: number; titulo: string; mensagem: string; imagemUrl: string | null; linkUrl: string; linkTexto: string; tipo: "faixa" | "modal"; ordem: number };

export type Conteudo = {
  configuracao: Configuracao; menu: ItemMenu[]; secoes: Secao[]; paginas: Pagina[]; solucoes: Solucao[];
  noticias: Noticia[]; parceiros: Parceiro[]; perguntas: Pergunta[];
};
