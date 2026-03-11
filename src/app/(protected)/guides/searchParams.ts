import { parseAsInteger, parseAsString } from "nuqs/server";

export const guidesSearchParams = {
  q: parseAsString.withDefault(""),
  games: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

