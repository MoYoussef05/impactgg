import { parseAsInteger, parseAsString } from "nuqs/server";

// Shared search param parsers (server-safe import).
// Can be reused later for loaders/serialization if needed.
export const gamesSearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

