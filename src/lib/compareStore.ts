"use client";

const STORAGE_KEY = "vipec-compare-parts";
const listeners = new Set<() => void>();

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cachedIds: string[] = readFromStorage();

function persist(ids: string[]) {
  cachedIds = ids;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSnapshot(): string[] {
  return cachedIds;
}

export function getServerSnapshot(): string[] {
  return [];
}

export function toggleCompare(id: string) {
  const current = readFromStorage();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id].slice(-4);
  persist(next);
}

export function removeFromCompare(id: string) {
  persist(readFromStorage().filter((x) => x !== id));
}

export function clearCompare() {
  persist([]);
}
