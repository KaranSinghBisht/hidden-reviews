import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Atmosphere } from "@/components/ambient/Atmosphere";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const title = "hidden.reviews — the reviews they bury, declassified";
const description =
  "An AI investigator that digs past page-one marketing to the honest, buried reviews real people leave — Reddit, Trustpilot, forums, blogs — and files the verdict, with sources. Live web via Nimble.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hidden-reviews.vercel.app"),
  title: { default: title, template: "%s · hidden.reviews" },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "hidden.reviews",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-cream">
        <Atmosphere />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
