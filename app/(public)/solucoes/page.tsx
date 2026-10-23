import type { Metadata } from "next";
import ListaSolucoes from "@/components/paginas/ListaSolucoes";

export const metadata: Metadata = { title: "Soluções" };

export default function SolucoesPage() {
  return <ListaSolucoes />;
}
