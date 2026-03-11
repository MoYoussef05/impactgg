import { describe, expect, it } from "vitest";

import { getPagination } from "./pagination";

describe("getPagination", () => {
  it("returns defaults for undefined page", () => {
    const result = getPagination(undefined, 24);
    expect(result).toEqual({
      page: 1,
      pageSize: 24,
      skip: 0,
      take: 24,
    });
  });

  it("uses provided positive page value", () => {
    const result = getPagination(3, 10);
    expect(result).toEqual({
      page: 3,
      pageSize: 10,
      skip: 20,
      take: 10,
    });
  });

  it("falls back to page 1 when page is less than 1", () => {
    const result = getPagination(0, 10);
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      skip: 0,
      take: 10,
    });
  });

  it("falls back to default page size when pageSize is not positive", () => {
    const result = getPagination(2, 0);
    expect(result).toEqual({
      page: 2,
      pageSize: 24,
      skip: 24,
      take: 24,
    });
  });
});

