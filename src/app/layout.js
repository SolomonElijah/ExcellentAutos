import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: {
    default: "Excellent J&C Autos – Buy, Sell & Finance Cars in Nigeria",
    template: "%s | Excellent J&C Autos",
  },
  description:
    "Excellent J&C Autos is a trusted platform to buy, sell, preorder, and finance cars in Nigeria. Browse verified cars, apply for car loans, and connect with sellers easily.",

  keywords: [
    "cars for sale in Nigeria",
    "buy cars Nigeria",
    "used cars Nigeria",
    "new cars Nigeria",
    "car loan Nigeria",
    "sell car Nigeria",
    "preorder cars Nigeria",
    "auto marketplace Nigeria",
  ],

  metadataBase: new URL("https://excellentautosnigeria.com"),

  icons: {
    icon: "/logo.png",        
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://excellentautosnigeria.com",
    siteName: "Excellent J&C Autos",
    title: "Excellent J&C Autos – Buy, Sell & Finance Cars in Nigeria",
    description:
      "Buy, sell, preorder, and finance cars in Nigeria. Explore verified listings and apply for car loans easily.",
    images: [
      {
        url: "/carbg.png", 
        width: 1200,
        height: 630,
        alt: "Excellent J&C Autos Nigeria",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Excellent J&C Autos – Buy, Sell & Finance Cars in Nigeria",
    description:
      "Browse cars for sale, apply for car loans, and sell your vehicle easily in Nigeria.",
    images: ["/carbg.png"], 
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
