# Site institucional P2P Corp (white-label)

Site público da empresa (Next.js 15, App Router, TypeScript), feito para
servir QUALQUER empresa: tudo — marca, cores, menu, páginas, seções, soluções,
notícias, FAQ, avisos e o chat — vem do banco e é editado no **admSite**
(`D:\desv\producao\hc\projetos\admSite`, menu **Site**). Modelo: o site
`D:\desv\producao\hc\projetos\site\ViaMob360` (mesma arquitetura).

**Este repositório é só o site — não tem painel.** Não recriar `/admin` aqui.

## Dados
- Firestore do ecossistema (mesmo projeto do admSite), em
  **`sites/{empresa}/<colecao>`** — `{empresa}` = `PORTAL_PATH` do `.env`
  (hoje `p2pcorp`, em MINÚSCULAS — o Firestore diferencia; com `P2PCORP` o site lia uma pasta vazia e
  mostrava só o conteúdo modelo, corrigido em 26/10/2026), o código da empresa em admSite → Configurações → Empresas
  (coleção raiz `sites`). Outra empresa = outra pasta `sites/<empresa>` e
  outra implantação deste site com outro `PORTAL_PATH`.
- Coleções (nomes em `lib/siteinstitucional/regrasSite.ts → COLECOES_SITE`):
  `configuracoes_site` (registro único — o ATIVO), `menu_site`, `secoes_site`,
  `paginas_site`, `solucoes_site`, `noticias_site`, `parceiros_site`,
  `perguntas_frequentes`, `avisos_site` e `leads_site` (gravada pelo
  formulário). Chat: `contatos_omnichannel`, `chats`, `messages` (Core do
  OmniChannel, atendido no admSite).
- `lib/siteinstitucional/` é CÓPIA do admSite (`shared/compartilhado/`
  `regrasSite.ts`, `conteudoModelo.ts`, `omnichannel.ts`) — NÃO editar aqui;
  mudar lá e rodar `npm run sync:regras`.
- **Conteúdo modelo:** com `configuracoes_site` vazia o site mostra o conteúdo
  modelo (`conteudoModelo.ts`, P2P Corp) — nunca abre em branco. Existindo a
  configuração, vale só o banco (para esconder algo: status rascunho/inativo).

## Páginas (tudo dinâmico)
- `/` = seções da página `inicio`; `/<slug>` = página de `paginas_site`
  (cabeçalho + Markdown + as seções com `pagina` = slug); `/contato` existe
  mesmo sem página (formulário padrão).
- `/solucoes` (filtro por categoria + busca) e `/solucoes/<slug>` (recursos,
  para quem, plataformas, seções `solucao-<slug>` e formulário de proposta).
- `/noticias` e `/noticias/<slug>`.
- Seções (`components/secoes/Secoes.tsx`): hero, numeros, cards, solucoes,
  texto_imagem, texto, parceiros, noticias, faq, cta, contato, chat. Itens =
  texto, uma linha por item, campos separados por `|` (`lerItens`). Links
  aceitam `/pagina`, `#secao`, `https://...` e `chat` (`LinkSite`). Ícones
  por nome (`components/public/Icone.tsx` ↔ `ICONES_SITE`).
- **LAYOUT = o do site ViaMob360, inteiro** (decisão do dono, 22/10/2026:
  "copia tudo, só muda o conteúdo"). `app/globals.css` é o CSS de
  `site/ViaMob360/app/globals.css` COPIADO + um complemento no fim (no mesmo
  estilo) para o que só este site tem; as cores da Configuração
  (`--cor/--destaque/--escura`) viram `--blue/--green/--navy`. Topo, rodapé,
  chat e cada seção usam as MESMAS classes do ViaMob360 (topbar/links com
  `.ativo` na página atual, hero, faixa-cards/cards8, section/section-head,
  two-col/panel, faq, cta, faixa-tripla/chat-painel, pagina-cab). Não
  inventar visual novo: mudou o visual lá → copiar para cá. Conferir contra
  `site/ViaMob360/documentacao/site_principal.png`.
- **Tema claro/escuro** (admSite → Configuração do site → `tema_site`:
  claro, escuro ou automático = segue o aparelho; `tema_botao` = botão sol/lua
  no topo, escolha do visitante no localStorage `tema-site`). `<html
  data-tema>` marcado pelo script do `<head>` (`lib/tema.ts`, sem piscar) e
  acompanhado ao vivo por `components/public/Tema.tsx`. As cores do escuro
  ficam no fim do `globals.css` (`html[data-tema="escuro"] ...`) — só cores,
  o layout é o mesmo. Logo do topo no escuro = a versão para fundo escuro.
- Na página com banner: a seção `numeros` LOGO DEPOIS do hero vira o quadro
  azul dele, e a 1ª seção `cards` (até 8 itens) sobe para logo abaixo do
  banner (a faixa de 8 cartões). Botão do hero em duas linhas: `Linha 1 |
  linha 2` (sem "|", quebra antes do 1º artigo/preposição). Cartão em
  vermelho (destaque) = item com link `chat`.
- Sem imagem cadastrada no hero, usa o banner da P2P Corp
  (`public/images/banner-p2pcorp.jpg`, `BANNER_PADRAO` em `Secoes.tsx`, desde
  23/10/2026). Sem logo cadastrado usa o logo da P2P Corp
  (`logo-p2pcorp.png`, `logo-p2pcorp-branco.png` no rodapé, `LOGO_PADRAO` em
  `Header.tsx`) e, sem favicon, `simbolo-p2pcorp.png`. Logo = dois "P"
  espelhados (par a par) ligados por um nó de conexão + "P2P Corp" + "TECNOLOGIA
  QUE CONECTA"; fonte em `documentacao/logo/logo.html` (SVG; PNG gerado com o
  Chrome headless, fundo transparente, `#branco` e `#simbolo` = variantes).
  (Banner e logo do ViaMob360 ficaram em `public/images/` só como referência.)
- Menu e rodapé (`menu_site`): mesmo `grupo` = submenu no topo e coluna no
  rodapé; `local` menu/rodape/ambos.

## Decisões
- **Tempo real, sem cache** (padrão ViaMob360): `force-dynamic`; o servidor
  lê tudo uma vez por requisição (`listarConteudo`, com `cache` do React) e o
  `AoVivoProvider` assina as coleções no navegador.
- **Cores** da Configuração viram `--cor`, `--destaque`, `--escura`
  (`app/globals.css`, CSS próprio, sem Tailwind). Títulos Poppins, texto Inter.
- **Chat** (`lib/chat.ts`, `components/chat/ChatCentral.tsx`): assunto → nome
  → fila da central do site (admSite → Parâmetros, grupo `atendimento`,
  chave `puc_site`), protocolo `SITE-AAAAMMDD-XXXXX`, conversa ao vivo.
- **Formulário de contato** (`lib/leads.ts`) → `leads_site` com aceite de
  LGPD e id sequencial (`incrementKey`).
- Só dado público. Regras do Firestore: precisam liberar `sites/**` (ver
  CLAUDE.md do admSite).

Roda local: `npm run dev` (porta 3000). Produção: `npm run build` e
`npm start` (ou `.next/standalone`).

## Seção "download" (28/10/2026)
`components/secoes/Download.tsx`: programa para baixar (lê ao vivo `sites/{empresa}/downloads_site/{codigo}`, gravado
pelo script de publicação do programa — AppBuilder: `npm run publicar:instalador`; clique soma `downloads`) + formulário
"Peça a sua chave de teste grátis" → `leads_site` tipo `chave_teste` (admSite → Interessados; a P2P Corp gera a chave no
AppBuilder → Licenças e envia). Itens da seção: 1ª linha = código (ex.: appbuilder), demais = passos extras.
