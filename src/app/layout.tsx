import type { Metadata } from "next";
import { Roboto_Mono, Merriweather } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Christian Joseph",
    template: "%s | Christian Joseph",
  },
  description:
    "Data Science student at UNC Charlotte. Projects in Python, SQL, and statistical analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${robotoMono.variable} ${merriweather.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
