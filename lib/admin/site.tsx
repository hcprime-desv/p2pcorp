// /admin do site P2P Corp: marca, menu, perfis e cadastros (o resto vem do kit do monorepo — scripts/copiar-admin-site.py).
// As MESMAS coleções e permissões (menu.site.*) do admsite360: o conteúdo pode ser editado aqui ou lá (as duas opções).
import {
  BookOpen, Building2, FileText, Gauge, HelpCircle, Inbox, LayoutTemplate, Layers, Megaphone, Menu as IconeMenu, Settings, UserCog, Users,
} from "lucide-react";
import {
  FUNDOS_SECAO, ICONES_SITE, LOCAIS_MENU, ROTULOS_STATUS_LEAD, ROTULOS_TEMA_SITE, ROTULOS_TIPO_LEAD, ROTULOS_TIPO_MENU, ROTULOS_TIPO_SECAO,
  STATUS_LEAD, STATUS_PUBLICACAO, TEMAS_SITE, TIPOS_LEAD, TIPOS_MENU, TIPOS_SECAO,
} from "@/lib/siteinstitucional/regrasSite";
import { cadastrosNucleo, PERMISSAO_GRUPOS, PERMISSAO_PAINEL, PERMISSAO_USUARIOS } from "./nucleo";
import type { Cadastro, Campo, Opcao, SiteAdmin } from "./tipos";

const P = {
  configuracao: "menu.site.configuracao", menu: "menu.site.menu", paginas: "menu.site.paginas", secoes: "menu.site.secoes",
  solucoes: "menu.site.solucoes", noticias: "menu.site.noticias", parceiros: "menu.site.parceiros", faq: "menu.site.faq",
  avisos: "menu.site.avisos", leads: "menu.site.leads",
};
const PERMISSOES: Record<string, string> = {
  [PERMISSAO_PAINEL]: "Painel", [P.configuracao]: "Configuração do site", [P.menu]: "Menu e rodapé", [P.paginas]: "Páginas",
  [P.secoes]: "Seções", [P.solucoes]: "Soluções", [P.noticias]: "Notícias", [P.parceiros]: "Clientes e parceiros",
  [P.faq]: "Perguntas frequentes", [P.avisos]: "Avisos", [P.leads]: "Interessados", [PERMISSAO_USUARIOS]: "Usuários", [PERMISSAO_GRUPOS]: "Grupos de permissões",
};
const CONTEUDO = [PERMISSAO_PAINEL, P.menu, P.paginas, P.secoes, P.solucoes, P.noticias, P.parceiros, P.faq, P.avisos];
// Perfis do admsite360 (compartilhado/acesso.ts): editor = conteúdo; comercial = interessados; auditoria = consulta.
const PERFIS: Opcao[] = [
  { valor: "administrador", rotulo: "Administrador (tudo)" }, { valor: "editor", rotulo: "Editor de conteúdo" },
  { valor: "comercial", rotulo: "Comercial (interessados)" }, { valor: "atendimento", rotulo: "Atendimento (chat)" }, { valor: "auditoria", rotulo: "Auditoria" },
];

const op = (lista: readonly string[], rotulos?: Record<string, string>): Opcao[] => lista.map((v) => ({ valor: v, rotulo: rotulos?.[v] ?? v }));
const STATUS_PUB = op(STATUS_PUBLICACAO, { publicado: "Publicado", rascunho: "Rascunho" });
const STATUS_CAD = op(["ativo", "inativo"], { ativo: "Ativo", inativo: "Inativo" });
const status = (opcoes: Opcao[], padrao: string): Campo => ({ nome: "status", rotulo: "Status", tipo: "select", obrigatorio: true, padrao, opcoes });
const ORDEM: Campo = { nome: "ordem", rotulo: "Ordem", tipo: "numero", padrao: 0 };
const SLUG: Campo = { nome: "slug", rotulo: "Endereço (slug)", tipo: "texto", obrigatorio: true, dica: "Só letras minúsculas, números e hífen." };
const porOrdem = (a: any, b: any) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0);
const slugOk = async (d: Record<string, any>) => (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug || "") ? d : "Endereço (slug): use só letras minúsculas, números e hífen.");

const CADASTROS: Cadastro[] = [
  {
    id: "configuracao", titulo: "Configuração do site", singular: "configuração", colecao: "configuracoes_site", permissao: P.configuracao, rotulo: "nome_site", unico: true,
    descricao: "Marca, cores, tema, contatos, redes, SEO e o chat do site.",
    campos: [
      { nome: "nome_site", rotulo: "Nome da empresa / site", tipo: "texto", obrigatorio: true, largura: 2 }, { nome: "slogan", rotulo: "Slogan", tipo: "texto" },
      { nome: "url_site", rotulo: "Endereço do site", tipo: "texto", largura: 2 }, status(STATUS_CAD, "ativo"),
      { nome: "cor_primaria", rotulo: "Cor principal", tipo: "cor" }, { nome: "cor_destaque", rotulo: "Cor de destaque", tipo: "cor" }, { nome: "cor_escura", rotulo: "Cor escura (topo, rodapé)", tipo: "cor" },
      { nome: "tema_site", rotulo: "Tema do site", tipo: "select", padrao: "escuro", opcoes: op(TEMAS_SITE, ROTULOS_TEMA_SITE) },
      { nome: "tema_botao", rotulo: "Mostrar botão claro/escuro no topo", tipo: "check", padrao: true },
      { nome: "cor_texto_escuro", rotulo: "Cor das letras no modo escuro", tipo: "cor", placeholder: "#bcd8ff" },
      { nome: "logo", rotulo: "Logo (vazio = nome em texto)", tipo: "imagem" }, { nome: "logo_rodape", rotulo: "Logo para fundo escuro", tipo: "imagem" }, { nome: "favicon", rotulo: "Ícone da aba (favicon)", tipo: "imagem" },
      { nome: "botao_topo_texto", rotulo: "Botão do topo (texto)", tipo: "texto" }, { nome: "botao_topo_link", rotulo: "Botão do topo (link)", tipo: "texto", largura: 2 },
      { nome: "razao_social", rotulo: "Razão social", tipo: "texto", largura: 2 }, { nome: "cnpj", rotulo: "CNPJ", tipo: "texto" },
      { nome: "email", rotulo: "E-mail de contato", tipo: "email" }, { nome: "telefone", rotulo: "Telefone", tipo: "texto" }, { nome: "whatsapp", rotulo: "WhatsApp", tipo: "texto" },
      { nome: "horario", rotulo: "Horário de atendimento", tipo: "texto" }, { nome: "endereco", rotulo: "Endereço", tipo: "texto", largura: 2 },
      { nome: "instagram_url", rotulo: "Instagram", tipo: "texto" }, { nome: "facebook_url", rotulo: "Facebook", tipo: "texto" }, { nome: "linkedin_url", rotulo: "LinkedIn", tipo: "texto" }, { nome: "youtube_url", rotulo: "YouTube", tipo: "texto" },
      { nome: "texto_rodape", rotulo: "Texto do rodapé", tipo: "textarea", largura: 3 }, { nome: "copyright", rotulo: "Nome na linha do © do rodapé", tipo: "texto" },
      { nome: "seo_titulo", rotulo: "Título para o Google (até 70)", tipo: "texto", largura: 2 }, { nome: "seo_descricao", rotulo: "Descrição para o Google (até 160)", tipo: "textarea", largura: 3 },
      { nome: "chat_ativo", rotulo: "Mostrar o chat no site", tipo: "check", padrao: true }, { nome: "chat_titulo", rotulo: "Título do chat", tipo: "texto" },
      { nome: "chat_saudacao", rotulo: "Saudação", tipo: "texto", largura: 2 }, { nome: "chat_assuntos", rotulo: "Assuntos (botões, um por linha)", tipo: "linhas" },
      { nome: "chat_pergunta_nome", rotulo: "Pergunta do nome", tipo: "texto", largura: 2 },
    ],
    colunas: [{ campo: "nome_site", rotulo: "Site" }],
  },
  {
    id: "menu", titulo: "Menu e rodapé", singular: "item do menu", colecao: "menu_site", permissao: P.menu, rotulo: "rotulo", ordenar: porOrdem,
    campos: [
      { nome: "rotulo", rotulo: "Texto", tipo: "texto", obrigatorio: true }, { nome: "tipo", rotulo: "Leva para", tipo: "select", obrigatorio: true, padrao: "pagina", opcoes: op(TIPOS_MENU, ROTULOS_TIPO_MENU) },
      ORDEM, { nome: "destino", rotulo: "Destino (slug da página, #âncora ou link)", tipo: "texto", largura: 2 }, { nome: "grupo", rotulo: "Grupo (submenu / coluna)", tipo: "texto" },
      { nome: "local", rotulo: "Onde aparece", tipo: "select", padrao: "ambos", opcoes: op(LOCAIS_MENU, { menu: "Menu do topo", rodape: "Rodapé", ambos: "Topo e rodapé" }) },
      { nome: "nova_aba", rotulo: "Abrir em nova aba", tipo: "check" }, status(STATUS_CAD, "ativo"),
    ],
    colunas: [{ campo: "ordem", rotulo: "Ordem" }, { campo: "rotulo", rotulo: "Texto" }, { campo: "tipo", rotulo: "Leva para", tipo: "opcao" }, { campo: "local", rotulo: "Onde", tipo: "opcao" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "paginas", titulo: "Páginas", singular: "página", colecao: "paginas_site", permissao: P.paginas, rotulo: "titulo", ordenar: porOrdem, preparar: slugOk,
    campos: [
      { nome: "titulo", rotulo: "Título", tipo: "texto", obrigatorio: true, largura: 2 }, SLUG, status(STATUS_PUB, "rascunho"), ORDEM,
      { nome: "imagem", rotulo: "Imagem (no início do conteúdo)", tipo: "imagem" }, { nome: "resumo", rotulo: "Resumo (abaixo do título)", tipo: "textarea", largura: 3 },
      { nome: "seo_descricao", rotulo: "Descrição para o Google (até 160)", tipo: "texto", largura: 3 },
      { nome: "conteudo", rotulo: "Conteúdo da página (opcional se só tiver seções)", tipo: "markdown" },
    ],
    colunas: [{ campo: "titulo", rotulo: "Título" }, { campo: "slug", rotulo: "Endereço" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "secoes", titulo: "Seções", singular: "seção", colecao: "secoes_site", permissao: P.secoes, rotulo: "titulo",
    ordenar: (a, b) => String(a.pagina).localeCompare(String(b.pagina)) || porOrdem(a, b),
    descricao: "Blocos de cada página (pagina = inicio para a Home, o slug da página, solucoes ou solucao-<slug>).",
    campos: [
      { nome: "pagina", rotulo: "Página", tipo: "texto", obrigatorio: true, padrao: "inicio" }, { nome: "tipo", rotulo: "Tipo de bloco", tipo: "select", obrigatorio: true, padrao: "texto", opcoes: op(TIPOS_SECAO, ROTULOS_TIPO_SECAO) }, ORDEM,
      { nome: "chamada", rotulo: "Chamada (texto pequeno acima do título)", tipo: "texto", largura: 2 }, { nome: "ancora", rotulo: "Âncora (#)", tipo: "texto" },
      { nome: "titulo", rotulo: "Título", tipo: "texto", largura: 2 }, { nome: "titulo_destaque", rotulo: "Final do título em destaque (cor)", tipo: "texto" },
      { nome: "fundo", rotulo: "Fundo", tipo: "select", padrao: "claro", opcoes: op(FUNDOS_SECAO, { claro: "Claro", suave: "Suave", escuro: "Escuro", destaque: "Destaque" }) }, status(STATUS_CAD, "ativo"),
      { nome: "texto", rotulo: "Texto", tipo: "markdown" },
      { nome: "itens", rotulo: "Itens (um por linha, campos separados por |)", tipo: "textarea", largura: 3 },
      { nome: "imagem", rotulo: "Imagem (banner do topo ou ao lado do texto)", tipo: "imagem", largura: 2 },
      { nome: "imagem_lado", rotulo: "Lado da imagem", tipo: "select", padrao: "direita", opcoes: op(["direita", "esquerda"], { direita: "Direita", esquerda: "Esquerda" }) },
      { nome: "botao_texto", rotulo: "Botão 1 (texto)", tipo: "texto" }, { nome: "botao_link", rotulo: "Botão 1 (link)", tipo: "texto", largura: 2 },
      { nome: "botao2_texto", rotulo: "Botão 2 (texto)", tipo: "texto" }, { nome: "botao2_link", rotulo: "Botão 2 (link)", tipo: "texto", largura: 2 },
    ],
    colunas: [{ campo: "pagina", rotulo: "Página" }, { campo: "ordem", rotulo: "Ordem" }, { campo: "tipo", rotulo: "Bloco", tipo: "opcao" }, { campo: "titulo", rotulo: "Título" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "solucoes", titulo: "Soluções", singular: "solução", colecao: "solucoes_site", permissao: P.solucoes, rotulo: "nome", ordenar: porOrdem, preparar: slugOk,
    campos: [
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, largura: 2 }, SLUG, status(STATUS_PUB, "rascunho"),
      { nome: "categoria", rotulo: "Categoria (área)", tipo: "texto" }, { nome: "icone", rotulo: "Ícone", tipo: "select", padrao: "layers", opcoes: op(ICONES_SITE) }, { nome: "cor", rotulo: "Cor", tipo: "cor" },
      { nome: "chamada", rotulo: "Chamada (frase curta)", tipo: "texto", largura: 3 }, { nome: "resumo", rotulo: "Resumo (cartão e topo da página)", tipo: "textarea", largura: 3 },
      { nome: "imagem", rotulo: "Imagem do topo da página (opcional)", tipo: "imagem" }, { nome: "banner", rotulo: "Banner da solução (Saiba mais e chatbot)", tipo: "imagem", largura: 2 },
      { nome: "link_externo", rotulo: "Site próprio da solução (opcional)", tipo: "texto", largura: 2 }, { nome: "destaque_home", rotulo: "Destaque na Home", tipo: "check" }, ORDEM,
      { nome: "publico", rotulo: "Para quem, um por linha", tipo: "linhas" }, { nome: "recursos", rotulo: "Recursos, um por linha", tipo: "linhas" }, { nome: "plataformas", rotulo: "Plataformas, uma por linha", tipo: "linhas" },
      { nome: "conteudo", rotulo: "Conteúdo da página", tipo: "markdown" },
    ],
    colunas: [{ campo: "banner", rotulo: "", tipo: "imagem" }, { campo: "nome", rotulo: "Nome" }, { campo: "categoria", rotulo: "Categoria" }, { campo: "destaque_home", rotulo: "Na Home", tipo: "check" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "noticias", titulo: "Notícias", singular: "notícia", colecao: "noticias_site", permissao: P.noticias, rotulo: "titulo", preparar: slugOk,
    ordenar: (a, b) => String(b.data_publicacao || "").localeCompare(String(a.data_publicacao || "")),
    campos: [
      { nome: "titulo", rotulo: "Título", tipo: "texto", obrigatorio: true, largura: 2 }, status(STATUS_PUB, "rascunho"), SLUG,
      { nome: "data_publicacao", rotulo: "Data de publicação", tipo: "dataiso", obrigatorio: true }, { nome: "categoria", rotulo: "Categoria", tipo: "texto" },
      { nome: "resumo", rotulo: "Resumo", tipo: "textarea", largura: 3 }, { nome: "imagem", rotulo: "Imagem", tipo: "imagem", largura: 2 }, { nome: "destaque", rotulo: "Destaque", tipo: "check" },
      { nome: "conteudo", rotulo: "Texto da notícia", tipo: "markdown", obrigatorio: true },
    ],
    colunas: [{ campo: "imagem", rotulo: "", tipo: "imagem" }, { campo: "titulo", rotulo: "Título" }, { campo: "data_publicacao", rotulo: "Data" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "parceiros", titulo: "Clientes e parceiros", singular: "cliente/parceiro", colecao: "parceiros_site", permissao: P.parceiros, rotulo: "nome", ordenar: porOrdem,
    campos: [
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, largura: 2 },
      { nome: "tipo", rotulo: "Tipo", tipo: "select", padrao: "cliente", opcoes: op(["cliente", "parceiro", "certificacao"], { cliente: "Cliente", parceiro: "Parceiro", certificacao: "Certificação" }) },
      status(STATUS_CAD, "ativo"), { nome: "logo", rotulo: "Logo", tipo: "imagem", largura: 2 }, { nome: "link", rotulo: "Link (opcional)", tipo: "texto", largura: 2 }, ORDEM,
    ],
    colunas: [{ campo: "logo", rotulo: "", tipo: "imagem" }, { campo: "nome", rotulo: "Nome" }, { campo: "tipo", rotulo: "Tipo", tipo: "opcao" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "faq", titulo: "Perguntas frequentes", singular: "pergunta", colecao: "perguntas_frequentes", permissao: P.faq, rotulo: "pergunta", ordenar: porOrdem,
    campos: [
      { nome: "pergunta", rotulo: "Pergunta", tipo: "texto", obrigatorio: true, largura: 2 }, status(STATUS_PUB, "publicado"),
      { nome: "resposta", rotulo: "Resposta", tipo: "markdown", obrigatorio: true }, { nome: "categoria", rotulo: "Categoria", tipo: "texto" }, ORDEM,
      { nome: "destaque_home", rotulo: "Destaque na Home", tipo: "check" },
    ],
    colunas: [{ campo: "pergunta", rotulo: "Pergunta" }, { campo: "categoria", rotulo: "Categoria" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "avisos", titulo: "Avisos", singular: "aviso", colecao: "avisos_site", permissao: P.avisos, rotulo: "titulo", ordenar: porOrdem,
    descricao: "Faixa no topo ou janela (pop-up) com período no ar.",
    campos: [
      { nome: "titulo", rotulo: "Título", tipo: "texto", obrigatorio: true, largura: 2 },
      { nome: "tipo", rotulo: "Como aparece", tipo: "select", padrao: "faixa", opcoes: op(["faixa", "modal"], { faixa: "Faixa no topo", modal: "Janela (pop-up)" }) },
      status(STATUS_CAD, "ativo"), { nome: "inicio_em", rotulo: "No ar a partir de", tipo: "datahora" }, { nome: "fim_em", rotulo: "Sai do ar em", tipo: "datahora" }, ORDEM,
      { nome: "mensagem", rotulo: "Mensagem", tipo: "markdown" },
      { nome: "imagem", rotulo: "Imagem (só na janela)", tipo: "imagem" }, { nome: "link_texto", rotulo: "Botão (texto)", tipo: "texto" }, { nome: "link_url", rotulo: "Botão (link)", tipo: "texto" },
    ],
    colunas: [{ campo: "titulo", rotulo: "Título" }, { campo: "tipo", rotulo: "Como", tipo: "opcao" }, { campo: "inicio_em", rotulo: "Início", tipo: "datahora" }, { campo: "fim_em", rotulo: "Fim", tipo: "datahora" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
  {
    id: "interessados", titulo: "Interessados", singular: "interessado", colecao: "leads_site", permissao: P.leads, rotulo: "nome", semNovo: true,
    ordenar: (a, b) => Number(b.created_at || 0) - Number(a.created_at || 0),
    descricao: "Quem pediu contato, proposta, parceria ou chave de teste pelo site.",
    campos: [
      { nome: "tipo", rotulo: "Tipo", tipo: "select", opcoes: op(TIPOS_LEAD, ROTULOS_TIPO_LEAD) }, { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true },
      { nome: "status", rotulo: "Status", tipo: "select", padrao: "novo", opcoes: op(STATUS_LEAD, ROTULOS_STATUS_LEAD) },
      { nome: "email", rotulo: "E-mail", tipo: "email" }, { nome: "telefone", rotulo: "Telefone / WhatsApp", tipo: "texto" }, { nome: "contatado_em", rotulo: "Contatado em", tipo: "datahora" },
      { nome: "organizacao", rotulo: "Órgão ou empresa", tipo: "texto" }, { nome: "cargo", rotulo: "Cargo", tipo: "texto" }, { nome: "solucao", rotulo: "Solução de interesse", tipo: "texto" },
      { nome: "assunto", rotulo: "Assunto", tipo: "texto" }, { nome: "origem", rotulo: "Página de origem", tipo: "texto" }, { nome: "aceite_lgpd", rotulo: "Aceitou a Política de Privacidade (LGPD)", tipo: "check" },
      { nome: "mensagem", rotulo: "Mensagem do interessado", tipo: "textarea", largura: 3 }, { nome: "observacoes", rotulo: "Anotações internas", tipo: "textarea", largura: 3 },
    ],
    colunas: [{ campo: "nome", rotulo: "Nome" }, { campo: "tipo", rotulo: "Tipo", tipo: "opcao" }, { campo: "organizacao", rotulo: "Órgão/empresa" }, { campo: "solucao", rotulo: "Solução" }, { campo: "status", rotulo: "Status", tipo: "selo" }],
  },
];

export const SITE_ADMIN: SiteAdmin = {
  nome: "P2P Corp",
  logo: "/images/logo-p2pcorp.png",
  logoBranco: "/images/logo-p2pcorp-branco.png",
  chaveSessao: "admin-p2pcorp",
  modulo: "site",
  permissoes: PERMISSOES,
  perfis: { administrador: "*", editor: CONTEUDO, comercial: [PERMISSAO_PAINEL, P.leads], atendimento: [PERMISSAO_PAINEL], auditoria: [PERMISSAO_PAINEL, P.leads] },
  menu: [
    { grupo: "Visão geral", itens: [
      { href: "/admin", rotulo: "Painel", permissao: PERMISSAO_PAINEL, icone: <Gauge size={18} /> },
      { href: "/admin/interessados", rotulo: "Interessados", permissao: P.leads, icone: <Inbox size={18} /> },
    ] },
    { grupo: "Conteúdo", itens: [
      { href: "/admin/solucoes", rotulo: "Soluções", permissao: P.solucoes, icone: <Layers size={18} /> },
      { href: "/admin/secoes", rotulo: "Seções", permissao: P.secoes, icone: <LayoutTemplate size={18} /> },
      { href: "/admin/paginas", rotulo: "Páginas", permissao: P.paginas, icone: <BookOpen size={18} /> },
      { href: "/admin/noticias", rotulo: "Notícias", permissao: P.noticias, icone: <FileText size={18} /> },
      { href: "/admin/parceiros", rotulo: "Clientes e parceiros", permissao: P.parceiros, icone: <Building2 size={18} /> },
      { href: "/admin/faq", rotulo: "Perguntas frequentes", permissao: P.faq, icone: <HelpCircle size={18} /> },
      { href: "/admin/avisos", rotulo: "Avisos", permissao: P.avisos, icone: <Megaphone size={18} /> },
      { href: "/admin/menu", rotulo: "Menu e rodapé", permissao: P.menu, icone: <IconeMenu size={18} /> },
    ] },
    { grupo: "Configurações", itens: [
      { href: "/admin/configuracao", rotulo: "Configuração do site", permissao: P.configuracao, icone: <Settings size={18} /> },
      { href: "/admin/usuarios", rotulo: "Usuários", permissao: PERMISSAO_USUARIOS, icone: <Users size={18} /> },
      { href: "/admin/grupos", rotulo: "Grupos de permissões", permissao: PERMISSAO_GRUPOS, icone: <UserCog size={18} /> },
    ] },
  ],
  cadastros: [...CADASTROS, ...cadastrosNucleo(PERMISSOES, PERFIS)],
};
