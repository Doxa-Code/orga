import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Orga Saas | Gestão facil do seu negócio",
  description:
    "Automatize suas cobranças, controle seu agendamentos de serviços, emita notas fiscais e muito mais",
};

const budkamber = localFont({
  src: [
    {
      path: "fonts/BudKamberBlack.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "fonts/BudKamberBlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "fonts/BudKamberXBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "fonts/BudKamberXBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "fonts/BudKamberBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "fonts/BudKamberBoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "fonts/BudKamberMedium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "fonts/BudKamberMedium.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "fonts/BudKamberItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "fonts/BudKamberLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "fonts/BudKamberLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "fonts/BudKamberRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "fonts/BudKamberThin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "fonts/BudKamberThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
  ],
});

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [{ media: "(prefers-color-scheme: light)" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${budkamber.className}`}>
      <body className="max-h-screen !overflow-hidden pb-10 mb-10">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
