import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductButton from "@/components/view-all-product-button";

const Homepage = async () => {
  const latestProduct = await getLatestProducts();
  const featuredProduct = await getFeaturedProducts();
  return (
    <>
      {featuredProduct.length > 0 && (
        <ProductCarousel data={featuredProduct}></ProductCarousel>
      )}
      <ProductList data={latestProduct} title="Newest Arrivals" limit={4} />
      <ViewAllProductButton />
    </>
  );
};

export default Homepage;
