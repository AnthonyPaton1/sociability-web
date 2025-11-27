import { getActiveBanners } from "@/lib/actions/advertising.actions";
import BannerCarouselClient from "./header/banner-carousel-client";

export default async function BannerCarousel() {
  const banners = await getActiveBanners();

  if (banners.length === 0) return null;

  return <BannerCarouselClient banners={banners} />;
}