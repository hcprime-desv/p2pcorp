// Formulário de contato → `leads_site` (admSite → Site → Interessados), com
// aceite de LGPD obrigatório e id sequencial (igual ao onSaveIncrement).
import { criarComIdSequencial } from "@/lib/firebase/gen";
import { emailValido, telefoneValido } from "@/lib/validacoes";
import { COLECOES_SITE, tipoLeadDoAssunto } from "@/lib/siteinstitucional/regrasSite";

export type DadosLead = { nome: string; email: string; telefone: string; organizacao: string; cargo: string; assunto: string; solucao: string; mensagem: string; aceite: boolean };
export const LEAD_VAZIO: DadosLead = { nome: "", email: "", telefone: "", organizacao: "", cargo: "", assunto: "", solucao: "", mensagem: "", aceite: false };

export function validarLead(d: DadosLead): Record<string, string> {
  const e: Record<string, string> = {};
  if (d.nome.trim().length < 3) e.nome = "Informe o seu nome.";
  if (!d.email.trim() && !d.telefone.trim()) e.email = "Informe um e-mail ou telefone para retorno.";
  if (d.email.trim() && !emailValido(d.email)) e.email = "E-mail inválido.";
  if (d.telefone.trim() && !telefoneValido(d.telefone)) e.telefone = "Telefone inválido.";
  if (d.mensagem.trim().length < 5) e.mensagem = "Escreva a sua mensagem.";
  if (!d.aceite) e.aceite = "É preciso concordar com a Política de Privacidade.";
  return e;
}

export async function enviarLead(d: DadosLead, origem: string): Promise<string> {
  return criarComIdSequencial(COLECOES_SITE.leads, {
    tipo: tipoLeadDoAssunto(d.assunto), nome: d.nome.trim(), email: d.email.trim().toLowerCase(), telefone: d.telefone.replace(/\D/g, ""),
    organizacao: d.organizacao.trim(), cargo: d.cargo.trim(), assunto: d.assunto, solucao: d.solucao, mensagem: d.mensagem.trim(),
    aceite_lgpd: true, aceite_em: Date.now(), origem, status: "novo",
  });
}
