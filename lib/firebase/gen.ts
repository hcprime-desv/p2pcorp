// Camada de dados do site, no padrão do `shared/gen/gen.ts` do admSite:
// listener com onSnapshot e id sequencial via sites/{empresa}/incrementKey.
//
// A empresa é fixa por implantação: `PORTAL_PATH` no .env (repassado ao
// navegador pelo next.config.js) = o código da empresa no admSite (documento
// da coleção raiz `sites`, ex.: "p2pcorp"). Todos os dados ficam em
// sites/{empresa}/... Sem valor padrão de propósito: nunca ler/gravar na
// empresa errada.
import {
  collection, doc, getDoc, getDocs, onSnapshot, query, runTransaction, setDoc, updateDoc, where, type Unsubscribe,
} from "firebase/firestore";
import { db } from "./client";

export const TENANT_PATH = process.env.PORTAL_PATH || undefined;

function caminhoTenant(): string {
  if (!TENANT_PATH) {
    throw new Error("PORTAL_PATH não configurado — defina no .env o código da empresa (sites/<empresa>) antes de ler/gravar no Firestore.");
  }
  return `sites/${TENANT_PATH}`;
}
const colRef = (colecao: string) => collection(db, `${caminhoTenant()}/${colecao}`);

// Listener em tempo real de uma coleção inteira — mesmo formato do `getAll` do admSite.
export function getAll(colecao: string, callback: (docs: any[]) => void): Unsubscribe {
  return onSnapshot(colRef(colecao), (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (e) => console.error(`[site] listener de ${colecao} indisponível`, e)); // mantém o que já está na tela
}

export async function getAllOnce(colecao: string): Promise<any[]> {
  const snap = await getDocs(colRef(colecao));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getDocOnce(colecao: string, id: string): Promise<any | null> {
  const snap = await getDoc(doc(colRef(colecao), id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function getDocOn(colecao: string, id: string, callback: (doc: any | null) => void): Unsubscribe {
  return onSnapshot(doc(colRef(colecao), id), (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null));
}

// Listener filtrado por um campo (as mensagens de um chat). Sem orderBy de
// propósito: evita índice composto — quem chama ordena.
export function filtrarOn(colecao: string, campo: string, valor: any, callback: (docs: any[]) => void): Unsubscribe {
  return onSnapshot(query(colRef(colecao), where(campo, "==", valor)), (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// Grava com id escolhido, SEM carimbar datas (o OmniChannel usa `created_at` em ms).
export async function gravarComId(colecao: string, id: string, dados: Record<string, any>, mesclar = false): Promise<void> {
  await setDoc(doc(colRef(colecao), id), dados, { merge: mesclar });
}

export async function gravarNovo(colecao: string, dados: Record<string, any>): Promise<string> {
  const ref = doc(colRef(colecao));
  await setDoc(ref, dados);
  return ref.id;
}

export async function atualizar(colecao: string, id: string, dados: Record<string, any>): Promise<void> {
  await updateDoc(doc(colRef(colecao), id), dados);
}

// Cria com id sequencial — mesma mecânica do `onSaveIncrement` do admSite
// (transação em incrementKey/{colecao}). Usado pelos formulários (leads_site).
export async function criarComIdSequencial(colecao: string, data: Record<string, any>): Promise<string> {
  const counterRef = doc(db, `${caminhoTenant()}/incrementKey`, colecao);
  const id = await runTransaction(db, async (t) => {
    const snap = await t.get(counterRef);
    const proximo = ((snap.data()?.countKey as number | undefined) ?? 0) + 1;
    if (snap.exists()) t.update(counterRef, { countKey: proximo });
    else t.set(counterRef, { countKey: proximo });
    return String(proximo);
  });
  const agora = Date.now();
  await setDoc(doc(colRef(colecao), id), { ...data, created_at: agora, updated_at: agora });
  return id;
}
