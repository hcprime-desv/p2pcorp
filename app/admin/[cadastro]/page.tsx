import { CadastroRota } from "@/components/admin/Cadastro";

// /admin/<cadastro> — um cadastro de lib/admin/site.tsx (SITE_ADMIN.cadastros).
export default async function CadastroPage({ params }: { params: Promise<{ cadastro: string }> }) {
  const { cadastro } = await params;
  return <CadastroRota id={cadastro} />;
}
