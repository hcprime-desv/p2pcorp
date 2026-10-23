// ═══ CÓPIA do admSite (shared/compartilhado/regrasSite.ts) — `npm run sync:regras`. NÃO EDITAR AQUI. ═══
// ═══ Site institucional (white-label) — regras COMUNS painel ⇄ site ═══
// Fonte: admSite (shared/compartilhado/regrasSite.ts). O site público
// (projetos/site/<empresa> → lib/siteinstitucional/) tem uma CÓPIA idêntica:
// `npm run sync:regras` lá. TS puro, sem import de fora desta pasta.
//
// Todo o conteúdo do site mora em sites/{empresa}/... e é editado no
// admSite. O site só lê (e grava leads_site + o chat do OmniChannel).

export const COLECOES_SITE = {
  configuracao: "configuracoes_site", // registro único (o ativo)
  menu: "menu_site",
  secoes: "secoes_site",
  paginas: "paginas_site",
  solucoes: "solucoes_site",
  noticias: "noticias_site",
  parceiros: "parceiros_site",
  perguntas: "perguntas_frequentes",
  avisos: "avisos_site",
  leads: "leads_site",
} as const;
// Página "inicio" = a Home do site (as seções com pagina "inicio").
export const PAGINA_INICIO = "inicio";

// ── Seções (blocos montáveis de qualquer página) ─────────────────────────
// Cada seção tem um TIPO, uma página (slug) e uma ordem. Os itens vão num
// texto, uma linha por item, campos separados por "|" (ver lerItens).
export const TIPOS_SECAO = [
  "hero", "numeros", "cards", "solucoes", "texto_imagem", "texto", "parceiros", "noticias", "faq", "cta", "contato", "chat",
] as const;
export type TipoSecao = (typeof TIPOS_SECAO)[number];
export const ROTULOS_TIPO_SECAO: Record<TipoSecao, string> = {
  hero: "Banner principal (topo)",
  numeros: "Números / indicadores",
  cards: "Cartões (ícone + título + texto)",
  solucoes: "Vitrine de soluções",
  texto_imagem: "Texto com imagem (e lista)",
  texto: "Texto livre (Markdown)",
  parceiros: "Logos de clientes / parceiros",
  noticias: "Últimas notícias",
  faq: "Perguntas frequentes",
  cta: "Chamada para ação",
  contato: "Contato (formulário + endereço)",
  chat: "Chat com a Central (embutido)",
};
// Como preencher "itens" em cada tipo (mostrado no painel).
export const AJUDA_ITENS_SECAO: Partial<Record<TipoSecao, string>> = {
  hero: "Selos abaixo dos botões, um por linha: Texto | ícone",
  numeros: "Um por linha: Valor | Texto | ícone (ex.: 24/7 | Agente IA no WhatsApp | bot)",
  cards: "Um por linha: Título | Texto | ícone | link (link opcional: /pagina, /solucoes/slug, #secao ou https://)",
  texto_imagem: "Lista com ✓, um por linha: Texto",
  solucoes: "Opcional — slugs das soluções a mostrar, um por linha (vazio = as marcadas 'Destaque na home')",
  parceiros: "Opcional — tipo a mostrar: cliente, parceiro ou certificacao (vazio = todos)",
  contato: "Assuntos do formulário, um por linha (vazio = os padrões)",
};
export const FUNDOS_SECAO = ["claro", "suave", "escuro", "destaque"] as const;
export type FundoSecao = (typeof FUNDOS_SECAO)[number];

// ── Tema do site (Configuração do site → tema_site) ──────────────────────
// automatico = segue o claro/escuro do aparelho do visitante. Com
// `tema_botao`, o visitante troca no topo (fica salvo no navegador dele).
export const TEMAS_SITE = ["claro", "escuro", "automatico"] as const;
export type TemaSite = (typeof TEMAS_SITE)[number];
export const ROTULOS_TEMA_SITE: Record<TemaSite, string> = { claro: "Claro", escuro: "Escuro", automatico: "Automático (segue o aparelho do visitante)" };

export type ItemSecao = { titulo: string; texto: string; icone: string; link: string };
export function lerItens(texto: unknown): ItemSecao[] {
  return String(texto ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [titulo = "", textoItem = "", icone = "", link = ""] = l.split("|").map((p) => p.trim());
      return { titulo, texto: textoItem, icone, link };
    });
}

// ── Menu ─────────────────────────────────────────────────────────────────
// destino conforme o tipo: pagina = slug; secao = âncora da Home (#id);
// link = URL; solucoes/noticias/contato/chat não precisam de destino.
export const TIPOS_MENU = ["pagina", "secao", "solucoes", "noticias", "contato", "chat", "link"] as const;
export type TipoMenu = (typeof TIPOS_MENU)[number];
export const ROTULOS_TIPO_MENU: Record<TipoMenu, string> = {
  pagina: "Página (slug)", secao: "Seção da Home (âncora)", solucoes: "Lista de soluções", noticias: "Notícias",
  contato: "Página de contato", chat: "Abrir o chat", link: "Link (URL)",
};
export const LOCAIS_MENU = ["menu", "rodape", "ambos"] as const;

export function hrefDoMenu(item: { tipo?: string; destino?: string }): string | null {
  const d = String(item.destino ?? "").trim();
  switch (item.tipo) {
    case "pagina": return d ? `/${d.replace(/^\/+/, "")}` : null;
    case "secao": return `/#${d.replace(/^#/, "") || "inicio"}`;
    case "solucoes": return d ? `/solucoes/${d}` : "/solucoes";
    case "noticias": return d ? `/noticias/${d}` : "/noticias";
    case "contato": return "/contato";
    case "link": return d || null;
    default: return null; // chat: botão
  }
}

// Link de um item/botão livre: "/x", "#secao", "https://..." ou "chat".
export function hrefLivre(link: string): string {
  const l = (link || "").trim();
  if (!l) return "";
  if (l.startsWith("#")) return `/${l}`;
  return l;
}

// ── Status ───────────────────────────────────────────────────────────────
export const STATUS_PUBLICACAO = ["publicado", "rascunho"] as const;
export const STATUS_ATIVO = ["ativo", "inativo"] as const;
export const publicado = (d: { status?: string }) => d?.status === "publicado";
export const ativo = (d: { status?: string }) => d?.status === "ativo";

const ms = (v: any): number => {
  if (v == null || v === "") return NaN;
  if (typeof v === "number") return v;
  if (typeof v?.toMillis === "function") return v.toMillis();
  if (typeof v?.toDate === "function") return v.toDate().getTime();
  if (typeof v?.seconds === "number") return v.seconds * 1000;
  return new Date(v).getTime();
};
export const emMs = (v: unknown): number => { const t = ms(v); return Number.isNaN(t) ? 0 : t; };

// Aviso no ar: ativo e dentro do período (início vazio = já; fim vazio = sem prazo).
export const avisoNoAr = (a: { status?: string; inicio_em?: unknown; fim_em?: unknown }, agora = Date.now()) =>
  a.status === "ativo" && (!a.inicio_em || ms(a.inicio_em) <= agora) && (!a.fim_em || ms(a.fim_em) > agora);

// ── Interessados (leads_site) ────────────────────────────────────────────
export const TIPOS_LEAD = ["contato", "proposta", "parceria", "trabalhe_conosco", "imprensa", "newsletter"] as const;
export type TipoLead = (typeof TIPOS_LEAD)[number];
export const ROTULOS_TIPO_LEAD: Record<TipoLead, string> = {
  contato: "Contato", proposta: "Pedido de proposta", parceria: "Parceria", trabalhe_conosco: "Trabalhe conosco", imprensa: "Imprensa", newsletter: "Newsletter",
};
export const STATUS_LEAD = ["novo", "em_contato", "convertido", "descartado"] as const;
export const ROTULOS_STATUS_LEAD: Record<(typeof STATUS_LEAD)[number], string> = {
  novo: "Novo", em_contato: "Em contato", convertido: "Convertido", descartado: "Descartado",
};
export const ASSUNTOS_CONTATO_PADRAO = [
  "Quero conhecer uma solução",
  "Pedido de proposta (órgão público)",
  "Pedido de proposta (empresa)",
  "Suporte a cliente",
  "Parcerias",
  "Trabalhe conosco",
  "Imprensa",
  "Outros assuntos",
];
// Funil do interessado (status atual → próximos permitidos).
export const TRANSICOES_LEADS_SITE: Record<(typeof STATUS_LEAD)[number], readonly (typeof STATUS_LEAD)[number][]> = {
  novo: ["em_contato", "convertido", "descartado"],
  em_contato: ["convertido", "descartado"],
  convertido: [],
  descartado: ["novo"],
};
export const tipoLeadDoAssunto = (assunto: string): TipoLead =>
  /proposta/i.test(assunto) ? "proposta" : /parceri/i.test(assunto) ? "parceria" : /trabalhe/i.test(assunto) ? "trabalhe_conosco" : /imprensa/i.test(assunto) ? "imprensa" : "contato";

// ── Ícones permitidos (nome → ícone do lucide no site) ───────────────────
export const ICONES_SITE = [
  "shield", "siren", "school", "graduation-cap", "heart-pulse", "hospital", "car", "bus", "truck", "ship", "scale", "factory",
  "briefcase", "users", "user", "headset", "bot", "message-circle", "phone", "mail", "bar-chart", "pie-chart", "lock", "zap",
  "building", "landmark", "globe", "map-pin", "map", "wifi-off", "smartphone", "monitor", "cloud", "server", "sparkles",
  "check-circle", "clipboard-check", "file-text", "search", "leaf", "recycle", "award", "rocket", "handshake", "clock", "settings", "layers", "palette",
] as const;

export const slugValido = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
// Slugs que não podem virar página (rotas próprias do site). "contato" PODE
// ser página: sem ela, /contato mostra o formulário padrão.
export const ROTAS_RESERVADAS = ["solucoes", "noticias", "api", "_next", "inicio"];
