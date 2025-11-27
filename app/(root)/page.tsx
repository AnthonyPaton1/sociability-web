import * as React from "react";
import ProductList from "@/components/shared/header/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import BannerCarousel from "@/components/shared/banner-carousel";
import ViewAllproductsBtn from "@/components/view-all-products-button";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <BannerCarousel />
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllproductsBtn />
    </>
  );
};

export default Homepage;
