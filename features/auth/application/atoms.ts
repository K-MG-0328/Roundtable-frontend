import { atom } from "jotai";
import type { AuthUser } from "@/features/auth/domain/types";

export const accessTokenAtom = atom<string | null>(null);
export const currentUserAtom = atom<AuthUser | null>(null);
export const authReadyAtom = atom<boolean>(false);

export const isAuthenticatedAtom = atom((get) => get(accessTokenAtom) !== null);
