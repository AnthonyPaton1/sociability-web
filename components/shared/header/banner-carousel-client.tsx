"use client";

import { useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

export default function BannerCarouselClient({
  banners,
}: {
  banners: Array<{
    id: string;
    title: string;
    image: string;
    link: string | null;
  }>;
}) {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="w-full mb-8">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              {banner.link ? (
                <Link href={banner.link}>
                  <div className="relative w-full h-[150px] md:h-[200px] lg:h-[250px] overflow-hidden rounded-lg">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
              ) : (
                <div className="relative w-full h-[150px] md:h-[200px] lg:h-[250px] overflow-hidden rounded-lg">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}