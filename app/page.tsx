import { getAllProducts } from "./_component/Service/ProductApi";
import { getAllCategories } from "./_component/Service/CategoryApi";
import FeaturedProducts from "./_component/FeaturedProducts/FeaturedProducts";
import HeroSlider from "./_component/HeroSlider/HeroSlider";
import HomeFeatures from "./_component/HomeFeatures/HomeFeatures";
import ShopByCategory from "./_component/ShopByCategory/ShopByCategory";
import PromoBanners from "./_component/PromoBanners/PromoBanners";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <HeroSlider />
        <HomeFeatures />
        <ShopByCategory categories={categories} />
        <PromoBanners />
        <FeaturedProducts products={products} />
      </div>
    </main>
  );
}
