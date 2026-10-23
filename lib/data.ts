// Leitura pública do site — o que o admSite (menu "Site") grava em
// sites/{empresa}/<colecao>. Só conteúdo público.
//
// Tempo real (padrão ViaMob360/portal181):
// - `listarConteudo` — leitura no servidor a cada acesso (force-dynamic):
//   o HTML já sai com o dado atual (SEO);
// - `subscribeConteudo` — listeners no navegador: editou no admSite, muda na tela.
//
// Conteúdo MODELO: enquanto a empresa não tiver a Configuração do site
// (coleção configuracoes_site vazia), o site mostra o conteúdo modelo
// (lib/siteinstitucional/conteudoModelo.ts) — nunca abre em branco. Depois
// que a configuração existe (admSite → Site → Configuração do site, salvar
// ou "Carregar conteúdo modelo"), vale SÓ o que está no banco. A
// configuração é o registro ATIVO (sem ativo, o primeiro).
import { getAll, getAllOnce } from "@/lib/firebase/gen";
import { avisoNoAr, COLECOES_SITE as C, emMs, FUNDOS_SECAO, TEMAS_SITE, TIPOS_MENU, TIPOS_SECAO, ativo, publicado } from "@/lib/siteinstitucional/regrasSite";
import * as M from "@/lib/siteinstitucional/conteudoModelo";
import { cache } from "react";
import type { Unsubscribe } from "firebase/firestore";
import type { Aviso, Configuracao, Conteudo, ItemMenu, Noticia, Pagina, Parceiro, Pergunta, Secao, Solucao } from "@/types/conteudo";

const txt = (v: any, padrao = "") => (typeof v === "string" && v.trim() ? v.trim() : padrao);
const url = (v: any) => (typeof v === "string" && v.trim() ? v.trim() : null);
const num = (v: any, padrao = 0) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || padrao);
const lista = (v: any): string[] => (Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : x?.label ?? x?.value ?? "")).map((x) => String(x).trim()).filter(Boolean) : []);
const HEX = /^#[0-9A-Fa-f]{6}$/;
const porOrdem = <T extends { ordem: number }>(a: T, b: T) => a.ordem - b.ordem;
const comId = (docs: Record<string, any>[]) => docs.map((d, i) => ({ id: String(i + 1), ...d }));

// ── Configuração ─────────────────────────────────────────────────────────
export function mapearConfiguracao(d: any): Configuracao {
  const p = M.CONFIGURACAO_MODELO;
  const x = d ?? p;
  const redes = (["instagram", "facebook", "linkedin", "youtube"] as const)
    .map((rede) => ({ rede, url: url(x[`${rede}_url`]) }))
    .filter((r): r is { rede: typeof r.rede; url: string } => !!r.url);
  const assuntos = lista(x.chat_assuntos);
  return {
    nomeSite: txt(x.nome_site, p.nome_site), slogan: txt(x.slogan), logoUrl: url(x.logo), logoRodapeUrl: url(x.logo_rodape), faviconUrl: url(x.favicon),
    corPrimaria: HEX.test(x.cor_primaria) ? x.cor_primaria : p.cor_primaria,
    corDestaque: HEX.test(x.cor_destaque) ? x.cor_destaque : p.cor_destaque,
    corEscura: HEX.test(x.cor_escura) ? x.cor_escura : p.cor_escura,
    tema: (TEMAS_SITE as readonly string[]).includes(x.tema_site) ? x.tema_site : "claro", temaBotao: x.tema_botao !== false,
    razaoSocial: txt(x.razao_social), cnpj: txt(x.cnpj), email: txt(x.email), telefone: txt(x.telefone), whatsapp: txt(x.whatsapp),
    endereco: txt(x.endereco), horario: txt(x.horario), redes,
    textoRodape: txt(x.texto_rodape), copyright: txt(x.copyright, txt(x.nome_site, p.nome_site)),
    seoTitulo: txt(x.seo_titulo, txt(x.nome_site, p.nome_site)), seoDescricao: txt(x.seo_descricao, txt(x.slogan)),
    botaoTopoTexto: txt(x.botao_topo_texto), botaoTopoLink: txt(x.botao_topo_link, "/contato"),
    chatAtivo: x.chat_ativo !== false, chatTitulo: txt(x.chat_titulo, "Fale com a Central"),
    chatSaudacao: txt(x.chat_saudacao, "Olá! 👋 Como podemos ajudar?"), chatAssuntos: assuntos.length ? assuntos : ["Outros assuntos"],
    chatPerguntaNome: txt(x.chat_pergunta_nome, "Para iniciar o atendimento, qual é o seu nome?"),
  };
}

// ── Coleções ─────────────────────────────────────────────────────────────
const mapearMenu = (docs: any[]): ItemMenu[] => docs.filter((d) => ativo(d) && d.rotulo)
  .map((d) => ({
    id: d.id, rotulo: txt(d.rotulo), tipo: (TIPOS_MENU as readonly string[]).includes(d.tipo) ? d.tipo : "link", destino: txt(d.destino),
    grupo: txt(d.grupo), local: d.local === "rodape" || d.local === "ambos" ? d.local : "menu", ordem: num(d.ordem), novaAba: d.nova_aba === true,
  } as ItemMenu)).sort(porOrdem);

const mapearSecoes = (docs: any[]): Secao[] => docs.filter((d) => ativo(d) && (TIPOS_SECAO as readonly string[]).includes(d.tipo))
  .map((d) => ({
    id: d.id, pagina: txt(d.pagina, "inicio"), tipo: d.tipo, ancora: txt(d.ancora), chamada: txt(d.chamada), titulo: txt(d.titulo), tituloDestaque: txt(d.titulo_destaque),
    texto: txt(d.texto), itens: typeof d.itens === "string" ? d.itens : "", imagemUrl: url(d.imagem), imagemLado: d.imagem_lado === "esquerda" ? "esquerda" : "direita",
    botaoTexto: txt(d.botao_texto), botaoLink: txt(d.botao_link), botao2Texto: txt(d.botao2_texto), botao2Link: txt(d.botao2_link),
    fundo: (FUNDOS_SECAO as readonly string[]).includes(d.fundo) ? d.fundo : "claro", ordem: num(d.ordem),
  } as Secao)).sort(porOrdem);

const mapearPaginas = (docs: any[]): Pagina[] => docs.filter((d) => publicado(d) && d.slug)
  .map((d) => ({ id: d.id, titulo: txt(d.titulo), slug: txt(d.slug), resumo: txt(d.resumo), conteudo: txt(d.conteudo), imagemUrl: url(d.imagem), seoDescricao: txt(d.seo_descricao), ordem: num(d.ordem) }))
  .sort(porOrdem);

const mapearSolucoes = (docs: any[]): Solucao[] => docs.filter((d) => publicado(d) && d.slug && d.nome)
  .map((d) => ({
    id: d.id, nome: txt(d.nome), slug: txt(d.slug), categoria: txt(d.categoria, "Soluções"), chamada: txt(d.chamada), resumo: txt(d.resumo), conteudo: txt(d.conteudo),
    publico: lista(d.publico), recursos: lista(d.recursos), plataformas: lista(d.plataformas), icone: txt(d.icone, "layers"),
    cor: HEX.test(d.cor) ? d.cor : "", imagemUrl: url(d.imagem), linkExterno: txt(d.link_externo), destaqueHome: d.destaque_home === true, ordem: num(d.ordem),
  })).sort(porOrdem);

const mapearNoticias = (docs: any[]): Noticia[] => docs.filter((d) => publicado(d) && d.slug && d.titulo)
  .map((d) => ({
    id: d.id, titulo: txt(d.titulo), slug: txt(d.slug), resumo: txt(d.resumo), conteudo: txt(d.conteudo), imagemUrl: url(d.imagem),
    data: emMs(d.data_publicacao) || emMs(d.created_at), categoria: txt(d.categoria), destaque: d.destaque === true,
  })).sort((a, b) => b.data - a.data);

const mapearParceiros = (docs: any[]): Parceiro[] => docs.filter((d) => ativo(d) && d.nome)
  .map((d) => ({ id: d.id, nome: txt(d.nome), logoUrl: url(d.logo), link: txt(d.link), tipo: txt(d.tipo, "cliente"), ordem: num(d.ordem) }))
  .sort(porOrdem);

const mapearPerguntas = (docs: any[]): Pergunta[] => docs.filter((d) => publicado(d) && d.pergunta)
  .map((d) => ({ id: d.id, pergunta: txt(d.pergunta), resposta: txt(d.resposta), categoria: txt(d.categoria, "geral"), destaqueHome: d.destaque_home === true, ordem: num(d.ordem) }))
  .sort(porOrdem);

export const mapearAvisos = (docs: any[]): Aviso[] => {
  const agora = Date.now();
  return docs.filter((d) => avisoNoAr(d, agora))
    .map((d) => ({
      id: d.id, versao: emMs(d.updated_at) || emMs(d.created_at), titulo: txt(d.titulo), mensagem: txt(d.mensagem), imagemUrl: url(d.imagem),
      linkUrl: txt(d.link_url), linkTexto: txt(d.link_texto), tipo: d.tipo === "modal" ? "modal" : "faixa", ordem: num(d.ordem),
    } as Aviso)).sort(porOrdem);
};

// Registro único da Configuração do site: o ativo (sem ativo, o primeiro).
const escolherConfiguracao = (docs: any[]) => docs.find((d) => d.status === "ativo") ?? docs[0] ?? null;

type Bruto = Record<"menu" | "secoes" | "paginas" | "solucoes" | "noticias" | "parceiros" | "perguntas", any[]>;
const MODELO_BRUTO: Bruto = {
  menu: comId(M.MENU_MODELO), secoes: comId(M.SECOES_MODELO), paginas: comId(M.PAGINAS_MODELO), solucoes: comId(M.SOLUCOES_MODELO),
  noticias: comId(M.NOTICIAS_MODELO), parceiros: comId(M.PARCEIROS_MODELO), perguntas: comId(M.PERGUNTAS_MODELO),
};
const COLECAO_DE: Record<keyof Bruto, string> = {
  menu: C.menu, secoes: C.secoes, paginas: C.paginas, solucoes: C.solucoes, noticias: C.noticias, parceiros: C.parceiros, perguntas: C.perguntas,
};

function montar(configDoc: any | null, b: Bruto): Conteudo {
  const fonte = configDoc ? b : MODELO_BRUTO;
  return {
    configuracao: mapearConfiguracao(configDoc), menu: mapearMenu(fonte.menu), secoes: mapearSecoes(fonte.secoes), paginas: mapearPaginas(fonte.paginas),
    solucoes: mapearSolucoes(fonte.solucoes), noticias: mapearNoticias(fonte.noticias), parceiros: mapearParceiros(fonte.parceiros), perguntas: mapearPerguntas(fonte.perguntas),
  };
}

// Leitura no servidor (a cada acesso; `cache` = uma leitura por requisição,
// mesmo com layout, página e metadata pedindo).
// Sem acesso ao banco (regras do Firestore sem `sites/**`, sem rede...): o
// site abre com o conteúdo modelo e o erro fica no log do servidor.
export const listarConteudo = cache(async function listarConteudo(): Promise<Conteudo> {
  try {
    const configDoc = escolherConfiguracao(await getAllOnce(C.configuracao));
    if (!configDoc) return montar(null, MODELO_BRUTO);
    const chaves = Object.keys(COLECAO_DE) as (keyof Bruto)[];
    const docs = await Promise.all(chaves.map((k) => getAllOnce(COLECAO_DE[k])));
    const b = Object.fromEntries(chaves.map((k, i) => [k, docs[i]])) as Bruto;
    return montar(configDoc, b);
  } catch (e) {
    console.error("[site] não foi possível ler sites/<empresa> — mostrando o conteúdo modelo", e);
    return montar(null, MODELO_BRUTO);
  }
});

// Listeners no navegador: qualquer mudança remonta o conteúdo inteiro.
export function subscribeConteudo(cb: (c: Conteudo) => void): Unsubscribe {
  let configDoc: any | null | undefined;
  const b: Bruto = { menu: [], secoes: [], paginas: [], solucoes: [], noticias: [], parceiros: [], perguntas: [] };
  const prontos = new Set<string>();
  const total = Object.keys(COLECAO_DE).length;
  const emitir = () => { if (configDoc !== undefined && (configDoc === null || prontos.size === total)) cb(montar(configDoc, b)); };
  const subs: Unsubscribe[] = [];
  try {
    subs.push(getAll(C.configuracao, (docs) => { configDoc = escolherConfiguracao(docs); emitir(); }));
    (Object.keys(COLECAO_DE) as (keyof Bruto)[]).forEach((k) => {
      subs.push(getAll(COLECAO_DE[k], (docs) => { b[k] = docs; prontos.add(k); emitir(); }));
    });
  } catch (e) {
    console.error("[site] listeners indisponíveis", e);
  }
  return () => subs.forEach((u) => u());
}

export const listarAvisosAtivos = async () => mapearAvisos(await getAllOnce(C.avisos));
export function subscribeAvisosAtivos(cb: (a: Aviso[]) => void): Unsubscribe {
  try { return getAll(C.avisos, (docs) => cb(mapearAvisos(docs))); } catch { return () => {}; }
}
