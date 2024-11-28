import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";

export const searchParamsCache = createSearchParamsCache({
  // flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
  //   []
  // ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  // sort: getSortingStateParser<BookType>().withDefault([
  //   { id: "createdAt", desc: true },
  // ]),
  orderBy: parseAsStringEnum(["CreatedOn-Asc", "CreatedOn-Desc"]).withDefault(
    "CreatedOn-Desc"
  ),
  title: parseAsString.withDefault(""),
  // categoryIds: parseAsArrayOf(z.enum(tasks.status.enumValues)).withDefault([]),
  categoryIds: parseAsArrayOf(z.string().uuid()).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
