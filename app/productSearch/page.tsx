import { redirect } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductSearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value) {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (item) query.append(key, item);
      }
    }
  }

  const qs = query.toString();
  redirect(qs ? `/products?${qs}` : "/products");
}
