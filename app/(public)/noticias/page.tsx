import type { Metadata } from "next";
import ListaNoticias from "@/components/paginas/ListaNoticias";

export const metadata: Metadata = { title: "Notícias" };

export default function NoticiasPage() {
  return <ListaNoticias />;
}
