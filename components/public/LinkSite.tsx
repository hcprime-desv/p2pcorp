"use client";

// Link de qualquer conteúdo editável: "/pagina", "#secao", "https://...",
// ou "chat" (abre o Chat com a Central). Vazio = não mostra nada.
import Link from "next/link";
import { useChat } from "@/components/chat/ChatCentral";
import { hrefLivre } from "@/lib/siteinstitucional/regrasSite";
import { ehExterno } from "@/lib/util";

export default function LinkSite({ href, className, children, novaAba, onClick }: {
  href: string; className?: string; children: React.ReactNode; novaAba?: boolean; onClick?: () => void;
}) {
  const { abrir } = useChat();
  const h = hrefLivre(href);
  if (!h) return null;
  if (h === "chat") return <button type="button" className={className} onClick={() => { onClick?.(); abrir(); }}>{children}</button>;
  if (ehExterno(h) || h.startsWith("mailto:") || h.startsWith("tel:")) {
    return <a href={h} className={className} target={novaAba || ehExterno(h) ? "_blank" : undefined} rel="noreferrer" onClick={onClick}>{children}</a>;
  }
  return <Link href={h} className={className} onClick={onClick} target={novaAba ? "_blank" : undefined}>{children}</Link>;
}
