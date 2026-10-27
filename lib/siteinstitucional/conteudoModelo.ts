// ═══ CÓPIA do admSite (shared/compartilhado/conteudoModelo.ts) — `npm run sync:regras`. NÃO EDITAR AQUI. ═══
// ═══ Site institucional — CONTEÚDO MODELO (P2P Corp) ═══
// Fonte: admSite (shared/compartilhado/conteudoModelo.ts). O site público
// (projetos/site/<empresa> → lib/siteinstitucional/) tem uma CÓPIA idêntica.
//
// Dois usos:
// - admSite → Site → Configuração do site → "Carregar conteúdo modelo":
//   grava tudo isto em sites/{empresa} (só nas coleções VAZIAS);
// - site: enquanto uma coleção estiver vazia, mostra este conteúdo (o site
//   nunca abre em branco). Depois de gravado, vale só o que está no banco.
// Campos com os mesmos nomes dos schemas (admSite: shared/shemas/site/).

const NL = "\n";

// Imagens de TESTE (padrão P2P Corp): caminhos relativos a `public/images/`,
// arquivos que existem no site E no admSite (mesmo nome nos dois). Outra
// empresa troca pelo upload na Configuração do site / na seção do banner.
export const IMAGENS_MODELO = {
  logo: "/images/logo-p2pcorp.png",
  logo_rodape: "/images/logo-p2pcorp-branco.png",
  favicon: "/images/simbolo-p2pcorp.png",
  banner: "/images/banner-p2pcorp.jpg",
  // AppCreator (solução, seção da home e notícia)
  appcreator_cabecalho: "/images/appcreator-cabecalho.jpg",
  appcreator_banner: "/images/appcreator-banner.jpg",
  appcreator_construtor: "/images/appcreator-construtor-ao-vivo.jpg",
  appcreator_tipos: "/images/appcreator-novo-sistema-tipos.jpg",
  appcreator_dashboard: "/images/appcreator-app-dashboard.jpg",
};

const SITE_APPCREATOR = "https://appcreator.p2pcorp.com.br";

// Contato padrão da carga de TESTE (P2P Corp): configuração do site e, na
// carga do núcleo (seedDados.ts), lotação e central do atendimento.
export const CONTATO_MODELO = {
  telefone: "(92) 99484-7338",
  email: "atendimento@p2pcorp.com.br",
  cnpj: "26.254.585/0001-60",
};

export const CONFIGURACAO_MODELO = {
  nome_site: "P2P Corp",
  slogan: "Tecnologia que conecta governo, empresas e cidadãos",
  logo: IMAGENS_MODELO.logo,
  logo_rodape: IMAGENS_MODELO.logo_rodape,
  favicon: IMAGENS_MODELO.favicon,
  cor_primaria: "#0b5cd5",
  cor_destaque: "#12b886",
  cor_escura: "#0b1f3a",
  tema_site: "claro",
  tema_botao: true,
  razao_social: "P2P Corp LTDA",
  cnpj: CONTATO_MODELO.cnpj,
  email: CONTATO_MODELO.email,
  telefone: CONTATO_MODELO.telefone,
  whatsapp: CONTATO_MODELO.telefone,
  endereco: "Rua Rio Iquiari, 20, Qd H24 Lt 20 — Novo Aleixo, Manaus/AM — CEP 69098-295",
  horario: "Segunda a sexta, das 8h às 18h • Agente IA 24/7",
  instagram_url: "",
  facebook_url: "",
  linkedin_url: "",
  youtube_url: "",
  texto_rodape: "Soluções digitais para o setor público e para empresas: atendimento omnichannel com IA, gestão operacional e aplicativos que funcionam até sem internet.",
  copyright: "P2P Corp LTDA",
  seo_titulo: "P2P Corp | Tecnologia para governo e empresas",
  seo_descricao: "Omnichannel com Agente IA no WhatsApp e soluções web e app para segurança, educação, saúde, mobilidade, frota e atendimento ao cidadão.",
  botao_topo_texto: "Fale com um especialista",
  botao_topo_link: "/contato",
  chat_ativo: true,
  chat_titulo: "Fale com a P2P Corp",
  chat_saudacao: "Olá! 👋 Sou a central da P2P Corp. Como podemos ajudar?",
  chat_assuntos: ["Conhecer as soluções", "Pedido de proposta", "Suporte a cliente", "Parcerias", "Outros assuntos"],
  chat_pergunta_nome: "Para iniciar o atendimento, qual é o seu nome?",
  status: "ativo",
};

export const MENU_MODELO = [
  { rotulo: "Início", tipo: "secao", destino: "inicio", grupo: "", local: "menu", ordem: 1 },
  { rotulo: "Sobre a P2P Corp", tipo: "pagina", destino: "sobre", grupo: "Empresa", local: "ambos", ordem: 2 },
  { rotulo: "Por que a P2P Corp", tipo: "secao", destino: "diferenciais", grupo: "Empresa", local: "menu", ordem: 3 },
  { rotulo: "Notícias", tipo: "noticias", destino: "", grupo: "Empresa", local: "ambos", ordem: 4 },
  { rotulo: "Soluções", tipo: "solucoes", destino: "", grupo: "", local: "ambos", ordem: 5 },
  { rotulo: "Setor público", tipo: "pagina", destino: "setor-publico", grupo: "", local: "ambos", ordem: 6 },
  { rotulo: "HcConecta Omnichannel + IA", tipo: "pagina", destino: "hcconecta", grupo: "", local: "ambos", ordem: 7 },
  { rotulo: "Contato", tipo: "contato", destino: "", grupo: "", local: "ambos", ordem: 8 },
  { rotulo: "Fale com a Central", tipo: "chat", destino: "", grupo: "", local: "rodape", ordem: 9 },
  { rotulo: "Política de Privacidade", tipo: "pagina", destino: "politica-de-privacidade", grupo: "", local: "rodape", ordem: 20 },
  { rotulo: "Termos de Uso", tipo: "pagina", destino: "termos-de-uso", grupo: "", local: "rodape", ordem: 21 },
].map((m) => ({ ...m, nova_aba: false, status: "ativo" }));

const secao = (pagina: string, ordem: number, s: Record<string, any>) => ({
  pagina, ordem, tipo: "texto", ancora: "", chamada: "", titulo: "", titulo_destaque: "", texto: "", itens: "", imagem: "", imagem_lado: "direita",
  botao_texto: "", botao_link: "", botao2_texto: "", botao2_link: "", fundo: "claro", status: "ativo", ...s,
});

export const SECOES_MODELO = [
  // ── Home ──────────────────────────────────────────────────────────────
  secao("inicio", 1, {
    tipo: "hero", ancora: "inicio", chamada: "Tecnologia para governo e empresas",
    titulo: "Soluções digitais que conectam", titulo_destaque: "governo, empresas e cidadãos.",
    texto: "Atendimento omnichannel com Agente IA no WhatsApp, gestão operacional e aplicativos que funcionam até sem internet — prontos para o seu órgão ou a sua empresa, com a sua marca.",
    itens: ["Omnichannel + IA | bot", "Web e App offline-first | wifi-off", "White-label | palette", "Suporte local na Amazônia | map-pin"].join(NL),
    botao_texto: "Conheça as soluções", botao_link: "/solucoes", botao2_texto: "Fale com um especialista", botao2_link: "/contato", fundo: "escuro",
    imagem: IMAGENS_MODELO.banner,
  }),
  secao("inicio", 2, {
    tipo: "numeros",
    itens: ["13 | soluções prontas para uso | layers", "Web + App | em cada solução | smartphone", "24/7 | Agente IA no WhatsApp | bot", "7 dias | para implantar o omnichannel | rocket"].join(NL),
  }),
  secao("inicio", 3, {
    tipo: "solucoes", ancora: "solucoes", chamada: "Portfólio", titulo: "Nossas soluções",
    texto: "Uma plataforma para cada desafio do setor público e privado — todas integradas ao mesmo atendimento omnichannel.",
    botao_texto: "Ver todas as soluções", botao_link: "/solucoes", fundo: "suave",
  }),
  secao("inicio", 4, {
    tipo: "cards", ancora: "para-quem", chamada: "Para quem", titulo: "Soluções para cada área do setor público",
    texto: "Secretarias, autarquias e órgãos de controle usam a mesma base tecnológica, cada um com os seus módulos.",
    itens: [
      "Segurança pública | Despacho de ocorrências, Disque Denúncia e inteligência para SSP, polícias, bombeiros e guardas. | shield | /solucoes/ciope-cad",
      "Educação | Gestão das escolas de ponta a ponta: pedidos, manutenção, patrimônio, alimentação e compras. | school | /solucoes/edugestao-360",
      "Saúde | Recepção, pulseiras NFC, centro de comando, enfermagem e higienização para hospitais e UPAs. | heart-pulse | /solucoes/saude-360",
      "Mobilidade urbana | Transporte por aplicativo com passageiro, motorista, fiscal e central de segurança. | car | /solucoes/viamob360",
      "Frota | Abastecimento, manutenção, checklists e condutores de veículos e embarcações. | truck | /solucoes/viafrota",
      "Fiscalização e metrologia | Portal da indústria e app de campo para fiscais do IPEM e órgãos reguladores. | scale | /solucoes/ipem-4-0",
      "Trabalho e emprego | Vagas, candidatos, empresas e cursos para secretarias de trabalho e SINE. | briefcase | /solucoes/emprega-mais",
      "Atendimento ao cidadão | WhatsApp oficial, chat, e-mail e voz numa só central, com Agente IA. | headset | /solucoes/hcconecta",
    ].join(NL),
  }),
  secao("inicio", 5, {
    tipo: "texto_imagem", ancora: "hcconecta", chamada: "Novo • Agente IA integrado", titulo: "Atendimento inteligente no WhatsApp, 24 horas",
    texto: "O **HcConecta** reúne WhatsApp, Instagram, Telegram, e-mail e voz num só painel. O Agente IA responde, faz a triagem e passa para a equipe quando precisa — com histórico, filas, SLA e auditoria.",
    itens: ["Atendimento 24/7 com respostas automáticas", "Triagem inteligente e envio de documentos", "Filas, SLA e transferência para humanos", "Gravação, trilha de auditoria e indicadores em tempo real"].join(NL),
    botao_texto: "Conheça o HcConecta", botao_link: "/hcconecta", botao2_texto: "Testar o Agente IA", botao2_link: "chat", imagem_lado: "direita",
  }),
  secao("inicio", 6, {
    tipo: "texto_imagem", ancora: "appcreator", fundo: "suave", chamada: "Novo • Sistemas em blocos com IA", titulo: "O sistema que a sua empresa precisa,", titulo_destaque: "sem programar.",
    texto: "Com o **AppCreator** você monta cadastros, painéis e relatórios arrastando blocos — ou descreve o que precisa e a IA monta para você. Publique na web ou como programa para Windows.",
    itens: ["Construtor visual com pré-visualização ao vivo", "IA que cria e ajusta o sistema a partir de uma descrição", "Sites prontos com área administrativa", "Abra e modernize sistemas que você já tem"].join(NL),
    imagem: IMAGENS_MODELO.appcreator_construtor, imagem_lado: "esquerda",
    botao_texto: "Conheça o AppCreator", botao_link: "/solucoes/appcreator", botao2_texto: "Acessar agora", botao2_link: SITE_APPCREATOR,
  }),
  secao("inicio", 7, {
    tipo: "cards", ancora: "diferenciais", chamada: "Por que a P2P Corp", titulo: "Tecnologia de ponta com DNA amazônico",
    itens: [
      "Alta disponibilidade | Infraestrutura em nuvem redundante e de baixa latência. | server",
      "Humano + IA | Equipe especializada trabalhando junto com o Agente IA. | users",
      "Funciona sem internet | Apps offline-first: o trabalho de campo não para quando o sinal cai. | wifi-off",
      "Sua marca | White-label: logo, cores e textos do seu órgão ou empresa. | palette",
      "Dashboards sob medida | Indicadores em tempo real para decisões rápidas. | bar-chart",
      "Segurança e LGPD | Perfis de acesso, trilha de auditoria e dados protegidos. | lock",
      "Implantação ágil | Omnichannel no ar em até 7 dias. | rocket",
      "Suporte local | Atendimento de Manaus para todo o Brasil. | map-pin",
    ].join(NL),
  }),
  secao("inicio", 8, { tipo: "parceiros", ancora: "clientes", chamada: "Confiança", titulo: "Quem trabalha com a gente" }),
  secao("inicio", 9, { tipo: "noticias", ancora: "noticias", chamada: "Novidades", titulo: "Últimas notícias", botao_texto: "Ver todas", botao_link: "/noticias" }),
  secao("inicio", 10, { tipo: "faq", ancora: "ajuda", chamada: "Ajuda", titulo: "Perguntas frequentes", fundo: "suave" }),
  secao("inicio", 11, {
    tipo: "cta", chamada: "Vamos conversar?", titulo: "Leve tecnologia de verdade para o seu órgão ou empresa.",
    texto: "Conte o seu desafio: a nossa equipe monta uma demonstração com a solução certa para você.",
    botao_texto: "Pedir uma proposta", botao_link: "/contato", botao2_texto: "Falar agora no chat", botao2_link: "chat", fundo: "destaque",
  }),

  // ── Sobre ─────────────────────────────────────────────────────────────
  secao("sobre", 1, {
    tipo: "cards", chamada: "Como trabalhamos", titulo: "O que nos move",
    itens: [
      "Missão | Levar tecnologia simples e confiável para quem atende o cidadão e move a economia. | rocket",
      "Visão | Ser referência em plataformas digitais para o setor público na Amazônia e no Brasil. | globe",
      "Valores | Transparência, segurança da informação, inovação e compromisso com o resultado. | award",
    ].join(NL),
  }),
  secao("sobre", 2, { tipo: "numeros", fundo: "suave", itens: ["13 | soluções no portfólio | layers", "Web + App | em cada solução | smartphone", "24/7 | Agente IA | bot", "Manaus/AM | matriz e suporte | map-pin"].join(NL) }),
  secao("sobre", 3, { tipo: "cta", titulo: "Quer conhecer a P2P Corp de perto?", texto: "Agende uma apresentação com a nossa equipe.", botao_texto: "Fale com a gente", botao_link: "/contato", fundo: "destaque" }),

  // ── Setor público ─────────────────────────────────────────────────────
  secao("setor-publico", 1, {
    tipo: "cards", chamada: "Por órgão", titulo: "Qual solução atende o seu órgão",
    itens: [
      "Secretaria de Segurança, PM, Bombeiros, SAMU e Guarda | CIOPE CAD (despacho) e Disque Denúncia 181. | siren | /solucoes/ciope-cad",
      "Secretaria de Educação | EduGestão 360: escolas, manutenção, patrimônio, alimentação e compras. | graduation-cap | /solucoes/edugestao-360",
      "Secretaria de Saúde e hospitais | Saúde 360: recepção, pulseiras NFC, enfermagem e centro de comando. | hospital | /solucoes/saude-360",
      "Transporte e mobilidade | ViaMob360: transporte por app com regulação e fiscalização. | bus | /solucoes/viamob360",
      "Órgãos com frota ou embarcações | ViaFrota: abastecimento, manutenção e condutores. | ship | /solucoes/viafrota",
      "IPEM, Inmetro e reguladores | IPEM 4.0: portal da indústria e app do fiscal. | factory | /solucoes/ipem-4-0",
      "Trabalho, emprego e SINE | Emprega Mais: vagas, candidatos e cursos. | briefcase | /solucoes/emprega-mais",
      "Ouvidorias e centrais do cidadão | HcConecta: WhatsApp, chat, e-mail e voz com Agente IA. | headset | /solucoes/hcconecta",
      "Pesquisas de campo | Pesquisa 360: questionários no app, mesmo sem internet. | clipboard-check | /solucoes/pesquisa-360",
      "Equipes de TI e inovação | AppCreator: sistemas próprios montados em blocos, com IA. | layers | /solucoes/appcreator",
    ].join(NL),
  }),
  secao("setor-publico", 2, {
    tipo: "texto_imagem", fundo: "suave", chamada: "Base comum", titulo: "Uma plataforma, vários produtos",
    texto: "Todas as soluções nascem do mesmo núcleo: login e perfis de acesso, parâmetros, atendimento omnichannel, notificações, relatórios e auditoria. O órgão contrata só os módulos de que precisa — e eles conversam entre si.",
    itens: ["Painel web para a gestão e app para quem está em campo", "Multi-órgão: cada cliente com os seus dados, marca e regras", "Trilha de auditoria em todas as operações", "Integração com WhatsApp oficial (API Cloud da Meta)"].join(NL),
  }),
  secao("setor-publico", 3, { tipo: "cta", titulo: "Quer ver funcionando no seu órgão?", texto: "Montamos uma demonstração com os dados e a marca da sua instituição.", botao_texto: "Agendar demonstração", botao_link: "/contato", fundo: "destaque" }),

  // ── HcConecta ─────────────────────────────────────────────────────────
  secao("hcconecta", 1, {
    tipo: "cards", chamada: "Recursos", titulo: "Tudo o que a sua central precisa",
    itens: [
      "Agente IA personalizável | Treinado para o seu negócio, no WhatsApp e no site. | bot",
      "Central omnichannel | WhatsApp, Instagram, Telegram, e-mail e voz num só painel. | message-circle",
      "Filas e SLA | Distribuição por central, prioridade e transferência. | layers",
      "Analytics e KPIs | Tempo de resposta, satisfação, volume e desempenho da equipe. | bar-chart",
      "Segurança e auditoria | Registro das interações e trilha para compliance. | lock",
      "Disparo de mensagens | Modelos aprovados do WhatsApp para avisos e campanhas. | mail",
    ].join(NL),
  }),
  secao("hcconecta", 2, { tipo: "chat", fundo: "suave", chamada: "Experimente", titulo: "Converse com a nossa central agora", texto: "Este chat cai na mesma central que os nossos clientes usam." }),
  secao("hcconecta", 3, { tipo: "cta", titulo: "Seu omnichannel no ar em até 7 dias.", botao_texto: "Quero contratar", botao_link: "/contato", fundo: "destaque" }),

  // ── AppCreator (seções da página /solucoes/appcreator) ────────────────
  secao("solucao-appcreator", 1, {
    tipo: "texto_imagem", chamada: "Construtor visual", titulo: "Arraste, ligue e", titulo_destaque: "veja funcionando.",
    texto: "Cada bloco é uma parte do sistema. Ligue o menu aos cadastros, os cadastros ao painel e ao relatório — e o sistema aparece ao lado, pronto para testar.",
    itens: ["Blocos de menu, cadastro, dashboard e relatório", "Campos com validação e máscara (CPF, CNPJ, telefone, placa…)", "Revisão automática aponta o que falta antes de publicar", "Catálogo com os componentes prontos e os próximos que chegam"].join(NL),
    imagem: IMAGENS_MODELO.appcreator_construtor,
  }),
  secao("solucao-appcreator", 2, {
    tipo: "texto_imagem", fundo: "suave", chamada: "Novo sistema", titulo: "Site, aplicação web ou", titulo_destaque: "programa para Windows.",
    texto: "Comece pelo tipo de entrega. O site já vem com a área administrativa para editar páginas, notícias, perguntas frequentes e o formulário de contato — um sistema só.",
    itens: ["Site estático: publica em qualquer hospedagem", "Site Node: com servidor, melhor para o Google", "Aplicação web: gestão montada com blocos, usada no navegador", "Aplicação para Windows: instalador próprio, abre mesmo sem o site no ar"].join(NL),
    imagem: IMAGENS_MODELO.appcreator_tipos, imagem_lado: "esquerda",
  }),
  secao("solucao-appcreator", 3, {
    tipo: "cards", chamada: "Inteligência artificial", titulo: "A IA trabalha junto com você",
    itens: [
      "Descreva e a IA monta | Conte o que o sistema precisa ter: ela cria os cadastros, o painel e o relatório. | sparkles",
      "Ajuste com uma frase | “Acrescente o campo vencimento” — a mudança aparece no desenho para você conferir. | bot",
      "Altere projetos de código | Abra a pasta de um sistema, peça a mudança e veja a diferença antes de aplicar. | file-text",
      "Refaça sistemas antigos | Traga um sistema em outra linguagem: a IA o remonta com os nossos componentes. | recycle",
      "Consumo sob controle | Cada plano tem a sua cota de pedidos à IA, com pacotes extras quando precisar. | bar-chart",
      "Seus dados protegidos | A chave da IA fica só no servidor da P2P Corp, nunca no navegador. | lock",
    ].join(NL),
  }),
  secao("solucao-appcreator", 4, {
    tipo: "texto_imagem", fundo: "suave", chamada: "Pronto para usar", titulo: "Painéis e relatórios", titulo_destaque: "desde o primeiro dia.",
    texto: "Indicadores coloridos, gráficos de barras, pizza e linha, filtros e relatórios para imprimir — montados a partir dos seus cadastros, sem escrever consultas.",
    itens: ["Indicadores que filtram a lista com um clique", "Gráficos por situação, por pessoa ou por mês", "Importação de planilha Excel/CSV com conferência antes de gravar", "Perfis de acesso: cada pessoa vê só o que pode"].join(NL),
    imagem: IMAGENS_MODELO.appcreator_dashboard,
  }),
  secao("solucao-appcreator", 5, {
    tipo: "cta", fundo: "destaque", titulo: "Crie o primeiro sistema hoje.",
    texto: "Entre no AppCreator e monte um sistema de exemplo em minutos — ou fale com a gente para uma demonstração.",
    botao_texto: "Acessar o AppCreator", botao_link: SITE_APPCREATOR, botao2_texto: "Falar agora no chat", botao2_link: "chat",
  }),

  // ── Contato ───────────────────────────────────────────────────────────
  secao("contato", 1, { tipo: "contato", titulo: "Fale com a P2P Corp", texto: "Atendimento comercial e suporte técnico. Responderemos o mais rápido possível." }),
];

export const PAGINAS_MODELO = [
  {
    titulo: "Sobre a P2P Corp", slug: "sobre", ordem: 1, status: "publicado", imagem: "",
    resumo: "Tecnologia de ponta com DNA amazônico e suporte local.",
    seo_descricao: "Conheça a P2P Corp, empresa de Manaus que desenvolve plataformas digitais para o setor público e empresas.",
    conteudo: [
      "A **P2P Corp** desenvolve plataformas digitais para órgãos públicos e empresas. Nascemos em Manaus e levamos para todo o Brasil soluções que unem **atendimento omnichannel com inteligência artificial**, **gestão operacional** e **aplicativos que funcionam até sem internet**.",
      "",
      "A nossa plataforma de atendimento, o **HcConecta** (antes Hyper Channel), é a base de todo o portfólio: segurança pública, educação, saúde, mobilidade urbana, frota, fiscalização, trabalho e emprego.",
      "",
      "## Como trabalhamos",
      "- **Uma base, vários produtos:** cada cliente contrata só os módulos de que precisa.",
      "- **Sua marca:** as soluções são white-label — logo, cores e textos do cliente.",
      "- **Do painel ao campo:** painel web para a gestão e app para quem está na rua.",
      "- **Perto de você:** suporte local e implantação acompanhada pela nossa equipe.",
    ].join(NL),
  },
  {
    titulo: "Soluções para o setor público", slug: "setor-publico", ordem: 2, status: "publicado", imagem: "",
    resumo: "Secretarias, autarquias e órgãos de controle atendidos pela mesma base tecnológica.",
    seo_descricao: "Soluções da P2P Corp para segurança pública, educação, saúde, mobilidade, frota, fiscalização e atendimento ao cidadão.",
    conteudo: "",
  },
  {
    titulo: "HcConecta — Omnichannel + IA", slug: "hcconecta", ordem: 3, status: "publicado", imagem: "",
    resumo: "Atendimento inteligente no WhatsApp e em todos os canais, com gestão unificada e indicadores em tempo real.",
    seo_descricao: "HcConecta: plataforma omnichannel com Agente IA no WhatsApp, filas, SLA, dashboards e auditoria.",
    conteudo: "O **HcConecta** é a plataforma omnichannel da P2P Corp. Antes chamada **Hyper Channel**, ela centraliza o atendimento do seu órgão ou empresa e potencializa o relacionamento com o cidadão e o cliente.",
  },
  {
    titulo: "Contato", slug: "contato", ordem: 4, status: "publicado", imagem: "",
    resumo: "Comercial, suporte e parcerias.", seo_descricao: "Fale com a P2P Corp: e-mail, telefone, WhatsApp e endereço.", conteudo: "",
  },
  {
    titulo: "Política de Privacidade", slug: "politica-de-privacidade", ordem: 10, status: "publicado", imagem: "",
    resumo: "Como tratamos os seus dados pessoais.", seo_descricao: "Política de privacidade do site da P2P Corp.",
    conteudo: [
      "> Texto modelo — revise com o jurídico antes de publicar.",
      "",
      "## Dados que coletamos",
      "Ao usar os formulários e o chat deste site, você informa dados como nome, e-mail, telefone, instituição e a sua mensagem.",
      "",
      "## Para que usamos",
      "Somente para responder ao seu contato, enviar propostas e prestar suporte. Não vendemos dados pessoais.",
      "",
      "## Seus direitos (LGPD)",
      "Você pode pedir acesso, correção ou exclusão dos seus dados pelo e-mail de contato informado no rodapé.",
    ].join(NL),
  },
  {
    titulo: "Termos de Uso", slug: "termos-de-uso", ordem: 11, status: "publicado", imagem: "",
    resumo: "Regras de uso deste site.", seo_descricao: "Termos de uso do site da P2P Corp.",
    conteudo: "> Texto modelo — revise com o jurídico antes de publicar." + NL + NL + "O conteúdo deste site é informativo. Marcas e nomes de produtos pertencem aos seus titulares.",
  },
];

const solucao = (ordem: number, s: Record<string, any>) => ({
  ordem, imagem: "", link_externo: "", destaque_home: true, status: "publicado", plataformas: ["Painel web", "App Android/iOS"], ...s,
});

export const SOLUCOES_MODELO = [
  solucao(1, {
    nome: "HcConecta", slug: "hcconecta", categoria: "Atendimento e Omnichannel", icone: "headset", cor: "#0b5cd5",
    chamada: "Omnichannel + Agente IA no WhatsApp",
    resumo: "WhatsApp oficial, Instagram, Telegram, e-mail e voz num só painel, com Agente IA 24/7, filas, SLA e indicadores.",
    publico: ["Qualquer órgão público", "Ouvidorias e centrais do cidadão", "Empresas"],
    recursos: ["Agente IA 24/7", "WhatsApp oficial (API Cloud)", "Chatbot e fluxos sem código", "Filas, PUC e SLA", "Disparo de mensagens", "Dashboards e auditoria"],
    plataformas: ["Painel web", "WhatsApp", "Chat no site"],
    conteudo: "Antes chamado **Hyper Channel**, o HcConecta é a base de atendimento de todas as soluções da P2P Corp.",
  }),
  solucao(2, {
    nome: "CIOPE CAD", slug: "ciope-cad", categoria: "Segurança pública", icone: "siren", cor: "#d6336c",
    chamada: "Central integrada de despacho",
    resumo: "Registro de ocorrências, despacho de viaturas, mapa operacional e atendimento integrado para centros de operações.",
    publico: ["Secretarias de Segurança (SSP)", "Polícias Militar e Civil", "Bombeiros e SAMU", "Guarda Municipal e Defesa Civil"],
    recursos: ["Ocorrências e natureza", "Despacho e viaturas", "Mapa operacional", "App embarcado", "Atendimento omnichannel", "Relatórios"],
    conteudo: "",
  }),
  solucao(3, {
    nome: "Disque Denúncia 181", slug: "disque-denuncia", categoria: "Segurança pública", icone: "shield", cor: "#7048e8",
    chamada: "Denúncia anônima, inteligência e difusão",
    resumo: "Recebimento de denúncias por telefone, site e WhatsApp, apuração, análise de inteligência, difusão e portal público.",
    publico: ["Secretarias de Segurança", "Polícias", "Ministério Público"],
    recursos: ["Denúncia anônima com protocolo", "Apuração e difusão", "Análise de inteligência", "Crimes emergentes", "Portal público (procurados, desaparecidos)"],
    plataformas: ["Painel web", "Portal público", "WhatsApp"], conteudo: "",
  }),
  solucao(4, {
    nome: "EduGestão 360", slug: "edugestao-360", categoria: "Educação", icone: "graduation-cap", cor: "#f08c00",
    chamada: "Gestão pública da educação, de ponta a ponta",
    resumo: "Uma necessidade registrada uma vez percorre todo o fluxo: atendimento às escolas, manutenção, obras, patrimônio, alimentação e compras.",
    publico: ["Secretarias de Educação estaduais e municipais", "Redes públicas de ensino"],
    recursos: ["EduAtende (pedidos das escolas)", "Infraestrutura e manutenção", "Patrimônio e almoxarifado", "Alimentação escolar", "Compras e documentos", "Painel do gestor"],
    conteudo: "",
  }),
  solucao(5, {
    nome: "Saúde 360", slug: "saude-360", categoria: "Saúde", icone: "heart-pulse", cor: "#e03131",
    chamada: "Hospital conectado com pulseiras NFC e IoT",
    resumo: "Agenda e recepção, pulseiras NFC, centro de comando, enfermagem com alertas e chamadas, higienização e escalas.",
    publico: ["Secretarias de Saúde", "Hospitais públicos", "UPAs e policlínicas"],
    recursos: ["Agenda e recepção", "Pulseiras NFC e dispositivos IoT", "Centro de comando", "Enfermagem, alertas e chamadas", "Higienização", "Escalas"],
    conteudo: "",
  }),
  solucao(6, {
    nome: "ViaMob360", slug: "viamob360", categoria: "Mobilidade urbana", icone: "car", cor: "#1e9e5a",
    chamada: "Mobilidade que aproxima",
    resumo: "Transporte individual por aplicativo com passageiro, motorista parceiro, fiscal, central de segurança, pagamentos e BI.",
    publico: ["Secretarias de Transporte e Mobilidade", "Agências reguladoras", "Operadoras de transporte"],
    recursos: ["App do passageiro e do motorista", "Fiscalização em campo", "SOS e Central de Segurança", "Pix e cartão", "Mapa de demanda", "Multi-cidade e white-label"],
    link_externo: "", conteudo: "",
  }),
  solucao(7, {
    nome: "ViaFrota", slug: "viafrota", categoria: "Frota", icone: "truck", cor: "#1971c2",
    chamada: "Gestão de frota terrestre e fluvial",
    resumo: "Abastecimento, manutenção, check-in e check-out de veículos, checklists, condutores, centros de custo e conciliação.",
    publico: ["Prefeituras e secretarias", "Autarquias", "Empresas com frota"],
    recursos: ["Abastecimento e cartões", "Manutenção", "Checklists e vistorias", "Condutores", "Embarcações", "Centro de custo e conciliação"],
    conteudo: "",
  }),
  solucao(8, {
    nome: "IPEM 4.0", slug: "ipem-4-0", categoria: "Fiscalização e metrologia", icone: "scale", cor: "#5f3dc4",
    chamada: "Hub digital de metrologia e conformidade",
    resumo: "Plataforma do órgão, Portal da Indústria (cada empresa vê só o que é dela) e app de campo para fiscais e técnicos.",
    publico: ["IPEM dos estados", "Inmetro", "Órgãos de fiscalização e regulação"],
    recursos: ["Plataforma central do órgão", "Portal IPEM Indústria", "App IPEM Field para fiscais", "Instrumentos e produtos", "Conformidade e prazos"],
    conteudo: "",
  }),
  solucao(9, {
    nome: "Emprega Mais", slug: "emprega-mais", categoria: "Trabalho e emprego", icone: "briefcase", cor: "#0c8599",
    chamada: "Vagas, candidatos e qualificação",
    resumo: "Abertura de vagas, banco de candidatos por CBO, empresas parceiras, cursos e acompanhamento do processo seletivo.",
    publico: ["Secretarias de Trabalho e Emprego", "SINE e balcões de emprego"],
    recursos: ["Vagas e CBO", "Candidatos e seleção", "Empresas", "Cursos", "Comunicados e enquetes"],
    plataformas: ["Painel web", "WhatsApp"], conteudo: "",
  }),
  solucao(10, {
    nome: "Gestor 360", slug: "gestor-360", categoria: "SMS e conformidade", icone: "clipboard-check", cor: "#2f9e44", destaque_home: false,
    chamada: "Segurança, Meio Ambiente e Saúde Ocupacional",
    resumo: "Auditoria documental, análise de documentos por IA, gestão de atividades SMS e não conformidades com plano de ação.",
    publico: ["Empresas e estatais", "Secretarias de Meio Ambiente"],
    recursos: ["Auditoria documental", "Análise por IA", "Atividades e apontamentos", "Não conformidades e eficácia"],
    conteudo: "",
  }),
  solucao(11, {
    nome: "Pesquisa 360", slug: "pesquisa-360", categoria: "Pesquisa e inteligência", icone: "search", cor: "#e8590c", destaque_home: false,
    chamada: "Pesquisas de campo, mesmo sem internet",
    resumo: "Projetos, questionários, missões por localidade e pesquisadores com app offline-first e acompanhamento em tempo real.",
    publico: ["Órgãos públicos", "Institutos de pesquisa", "Empresas"],
    recursos: ["Questionários com lógica", "Missões e metas", "App offline-first", "Painel de resultados"],
    conteudo: "",
  }),
  solucao(12, {
    nome: "HyperCorp 360", slug: "hypercorp-360", categoria: "Inteligência corporativa", icone: "building", cor: "#495057", destaque_home: false,
    chamada: "Compras, fornecedores e custos com IA",
    resumo: "Memória operacional da empresa: fornecedores, cotações, preços, projetos e margens, com IA para recomendar onde comprar e quanto cobrar.",
    publico: ["Empresas", "Indústrias"],
    recursos: ["Compras e cotações (RFQ)", "Gestão de fornecedores", "Custos e margens", "Gestão de resíduos"],
    conteudo: "",
  }),
  solucao(13, {
    nome: "AppCreator", slug: "appcreator", categoria: "Desenvolvimento de sistemas", icone: "layers", cor: "#1559C7",
    chamada: "O sistema que a sua empresa precisa, sem programar",
    resumo: "Cadastros, painéis e relatórios montados arrastando blocos — ou descritos para a IA. Publique na web ou como programa para Windows, crie sites com área administrativa e modernize sistemas que você já tem.",
    publico: ["Empresas de qualquer porte", "Órgãos públicos e secretarias", "Software houses e consultorias", "Equipes de TI e inovação"],
    recursos: [
      "Construtor visual por blocos: menu, cadastro, dashboard e relatório",
      "IA que monta o sistema a partir de uma descrição em português",
      "Pré-visualização ao vivo, com dados de exemplo",
      "Gráficos de barras, pizza e linha e importação de planilhas",
      "Sites prontos (estático ou Node) já com área administrativa",
      "Projetos de código: abra um sistema, peça mudanças à IA ou refaça um sistema antigo",
      "Entrega na web ou como programa para Windows",
      "Equipe com perfis de acesso, planos e consumo de IA sob controle",
    ],
    plataformas: ["Web", "Windows"], link_externo: SITE_APPCREATOR, imagem: IMAGENS_MODELO.appcreator_cabecalho,
    conteudo: [
      "## Como funciona",
      "",
      "1. **Escolha o que criar** — site estático, site Node, aplicação web ou aplicação para Windows.",
      "2. **Monte ou descreva** — arraste os blocos e ligue um ao outro, ou conte para a IA o que o sistema precisa ter.",
      "3. **Veja funcionando** — o sistema aparece ao lado do desenho, já com dados de exemplo para testar.",
      "4. **Publique** — a sua equipe entra com login e perfil de acesso; todo sistema nasce com o usuário administrador `adm.<nome-do-sistema>`.",
      "",
      "Tudo o que o AppCreator gera usa os mesmos componentes das soluções da P2P Corp: telas de cadastro, painéis com indicadores, relatórios, atendimento e segurança já testados em produção.",
    ].join(NL),
  }),
];

export const NOTICIAS_MODELO = [
  {
    titulo: "P2P Corp lança o AppCreator: sistemas em blocos, com IA", slug: "p2p-corp-lanca-appcreator", data_publicacao: "2026-10-26", categoria: "Lançamento",
    resumo: "A nova plataforma monta cadastros, painéis, relatórios e sites arrastando blocos — ou a partir de uma descrição para a IA.",
    conteudo: [
      "A **P2P Corp** lança o **AppCreator**, plataforma para criar sistemas de gestão e sites sem programar.",
      "",
      "O usuário escolhe o tipo de entrega — site estático, site Node, aplicação web ou programa para Windows — e monta o sistema arrastando blocos de menu, cadastro, dashboard e relatório. Quem preferir pode descrever o sistema em português: a inteligência artificial monta o desenho, que aparece funcionando ao lado, com dados de exemplo.",
      "",
      "Os sites já nascem com a área administrativa, e a função **Projetos de código** permite abrir sistemas existentes para alterar com a ajuda da IA ou refazê-los com os componentes da P2P Corp.",
      "",
      "Conheça em [appcreator.p2pcorp.com.br](" + SITE_APPCREATOR + ") ou na página da solução: [AppCreator](/solucoes/appcreator).",
    ].join(NL),
    imagem: IMAGENS_MODELO.appcreator_banner, destaque: true, status: "publicado",
  },
  {
    titulo: "P2P Corp lança o seu novo portal", slug: "novo-portal-p2p-corp", data_publicacao: "2026-10-22", categoria: "Institucional",
    resumo: "O novo site reúne todo o portfólio de soluções e o atendimento com a central em um só lugar.",
    conteudo: "O novo portal da **P2P Corp** apresenta as soluções para o setor público e para empresas, com chat direto com a nossa central e formulário de proposta.",
    imagem: "", destaque: true, status: "publicado",
  },
];

export const PERGUNTAS_MODELO = [
  { pergunta: "As soluções funcionam sem internet?", resposta: "Os aplicativos de campo são offline-first: o trabalho é gravado no aparelho e sincronizado quando o sinal volta.", categoria: "geral", destaque_home: true, ordem: 1 },
  { pergunta: "Posso usar com a marca do meu órgão ou empresa?", resposta: "Sim. As soluções são white-label: logo, cores, nome e textos são configurados para cada cliente.", categoria: "geral", destaque_home: true, ordem: 2 },
  { pergunta: "Como é feita a implantação?", resposta: "A nossa equipe faz o levantamento, configura os módulos, carrega os dados iniciais e treina os usuários. O omnichannel fica no ar em até 7 dias.", categoria: "geral", destaque_home: true, ordem: 3 },
  { pergunta: "O atendimento pelo WhatsApp usa a API oficial?", resposta: "Sim. O HcConecta usa a API Cloud oficial do WhatsApp Business, com modelos de mensagem aprovados pela Meta.", categoria: "omnichannel", destaque_home: true, ordem: 4 },
  { pergunta: "Como os dados são protegidos?", resposta: "Cada cliente tem os seus dados separados, com perfis de acesso por usuário e trilha de auditoria das operações.", categoria: "geral", destaque_home: true, ordem: 5 },
  { pergunta: "Como pedir uma proposta?", resposta: "Use o formulário de contato ou o chat do site. Montamos uma demonstração com a solução certa para o seu caso.", categoria: "comercial", destaque_home: true, ordem: 6 },
].map((p) => ({ ...p, status: "publicado" }));

export const PARCEIROS_MODELO: Record<string, any>[] = [];
export const AVISOS_MODELO: Record<string, any>[] = [];
