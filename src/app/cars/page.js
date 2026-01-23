import { Suspense } from "react";
import Product from "@/components/Product";

export const metadata = {
  title: "Cars for Sale in Nigeria",
  description:
    "Browse cars for sale in Nigeria. Filter by brand, price, condition, and location. Find reliable new and used cars on Carsale.",
  keywords: [
    "cars for sale",
    "used cars Nigeria",
    "new cars Nigeria",
    "car listings Nigeria",
  ],
};


export default function CarsPage() {
  return (
    <Suspense fallback={null}>
      <Product />
    </Suspense>
  );
}
