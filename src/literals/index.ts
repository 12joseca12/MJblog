import rawLiterals from "./literals.json";
import type { LiteralsJson } from "@/types";

export const literals = rawLiterals as LiteralsJson;

export function getLiteral<S extends keyof LiteralsJson, K extends keyof LiteralsJson[S]>(
  section: S,
  key: K
): LiteralsJson[S][K] {
  return literals[section][key];
}
