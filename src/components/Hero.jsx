"use client";

import HeroImage from "@/components/HeroImage";
import CarCarousel from "@/components/HeroCarousel";
import HeroSearchSection from "@/components/HeroSearchSection";
import Product from "@/components/HeroProduct";
import Loader from "@/components/Loader";



export default function Hero() {
  return (
    <>
    <Loader />
      {/* <HeroImage /> */}
        <div>
          <CarCarousel />
        </div>
      <HeroSearchSection />
      <Product />
    </>
  );
}
