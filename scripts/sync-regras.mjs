// Copia do admSite (fonte) para o site as regras comuns, o conteúdo modelo e
// as regras do OmniChannel (chat). Uso: npm run sync:regras (pasta do
// admsite360 em ../../apps/admsite360, ou ADMSITE=<caminho do admSite>).
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const origem = resolve(process.env.ADMSITE || join(process.cwd(), "..", "..", "apps", "admsite360"), "shared/compartilhado");
const CABECALHO = (arq) => `// ═══ CÓPIA do admSite (shared/compartilhado/${arq}) — \`npm run sync:regras\`. NÃO EDITAR AQUI. ═══\n`;
for (const arq of ["regrasSite.ts", "conteudoModelo.ts", "omnichannel.ts"]) {
  const texto = readFileSync(join(origem, arq), "utf8").replace(/\r\n/g, "\n");
  writeFileSync(join(process.cwd(), "lib/siteinstitucional", arq), CABECALHO(arq) + texto);
  console.log("copiado:", arq);
}
