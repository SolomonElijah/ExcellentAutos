import { Suspense } from "react";
import CarLoanClient from "./CarLoanClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CarLoanClient />
    </Suspense>
  );
}
