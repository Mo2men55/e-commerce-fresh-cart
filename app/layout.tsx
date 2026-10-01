import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import Nav from "./_component/NavBar/Nav";
import Footer from "./_component/Footer/Footer";
import MyProvider from "./_component/MyProvider/MyProvider";
import Providers from "./_component/TanstackProvider/TanstackProvider";
import { Toaster } from "@/components/ui/toast";


const Exofont = Exo({
  variable: "--font-Exo",
  weight:['100','400' ,'700']
});

export const metadata: Metadata = {
  title: "E-Commerce (Fresh Cart)",
  description:
    "E-Commerce (Fresh Cart) — shop products by category and brand, manage cart and wishlist, check out securely, track orders, and manage your account.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${Exofont.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col ">
        <Providers>

        <MyProvider>
        <Nav />
        {children}
        <Toaster />
        <Footer/>
        </MyProvider>
        </Providers>
        
        </body>
    </html>
  );
}
