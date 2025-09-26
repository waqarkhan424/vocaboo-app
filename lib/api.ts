// export const API_BASE =
//   __DEV__ ? "http://10.0.2.2:3000/api/v1" : "https://vocab-api-chi.vercel.app/api/v1";


export const API_BASE = "https://vocab-api-chi.vercel.app/api/v1";


export type Topic = { topic: string; count: number };
export type Word = {
  id: string;
  word: string;
  definition: string;
  urduMeaning: string;
  example?: string;
  topic: string;
};
export type Paged<T> = { items: T[]; page: number; limit: number; total: number; hasMore: boolean };

export async function fetchTopics(): Promise<Topic[]> {
  const r = await fetch(`${API_BASE}/vocab/topics`);
  if (!r.ok) throw new Error("Failed to fetch topics");
  return r.json();
}

export async function fetchWords(params: { topic?: string; q?: string; page?: number; limit?: number }) {
  const u = new URL(`${API_BASE}/vocab`);
  if (params.topic) u.searchParams.set("topic", params.topic);
  if (params.q) u.searchParams.set("q", params.q);
  u.searchParams.set("page", String(params.page ?? 1));
  u.searchParams.set("limit", String(params.limit ?? 20));
  const r = await fetch(u.toString());
  if (!r.ok) throw new Error("Failed to fetch words");
  return (await r.json()) as Paged<Word>;
}
