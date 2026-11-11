import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

// /admin — gerenciamento do conteúdo do próprio site (kit do monorepo). O mesmo conteúdo também é gerenciado pelo admsite360.
export const metadata: Metadata = { title: "Área restrita", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
