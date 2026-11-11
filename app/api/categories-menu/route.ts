import { NextResponse } from "next/server";
import { getAllCategories } from "@/app/_component/Service/CategoryApi";
import { getAllSubcategories } from "@/app/_component/Service/SubCategoryApi";

export type MenuCategory = {
  _id: string;
  name: string;
  image: string;
  subcategories: { _id: string; name: string }[];
};

// GET /api/categories-menu → categories with their subcategories nested, for the navbar.
export async function GET() {
  try {
    const [categories, subcategories] = await Promise.all([
      getAllCategories(),
      getAllSubcategories(),
    ]);

    const menu: MenuCategory[] = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      image: category.image,
      subcategories: subcategories
        .filter((sub) => sub.category === category._id)
        .map((sub) => ({ _id: sub._id, name: sub.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));

    return NextResponse.json(
      { data: menu },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json({ message: "Failed to load categories", data: [] }, { status: 502 });
  }
}
