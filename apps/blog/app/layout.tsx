import Footer from "@/components/organism/footer";
import Header from "@/components/organism/header";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata = {
  title: "Blog do Budget",
  description: "Descomplicando as finanças",
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="pt-BR" className={budkamber.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
