export function getPagination(page: number | undefined, pageSize: number) {
  const p = Number.isFinite(page) && page && page > 0 ? page : 1;
  const size = pageSize > 0 ? pageSize : 24;
  const skip = (p - 1) * size;
  return { page: p, pageSize: size, skip, take: size };
}

