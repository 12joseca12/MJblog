import rawLiterals from "./literals.json";
import type { LiteralsJson } from "@/types";

export const literals = rawLiterals as LiteralsJson;

export function getLiteral(
  section: keyof LiteralsJson,
  key: keyof LiteralsJson[typeof section]
) {
  return literals[section][key];
}