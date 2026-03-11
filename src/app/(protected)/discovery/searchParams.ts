import { parseAsInteger, parseAsString } from "nuqs/server";

export const discoverySearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

