import { parseAsInteger, parseAsString } from "nuqs/server";

export const coachingSearchParams = {
  q: parseAsString.withDefault(""),
  games: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault("recent"),
};

