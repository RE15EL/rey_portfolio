import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default:
      "Reisel Valle - Fullstack Developer | React, Angular, Node.js, Express",
    template: "%s | Reisel Valle - Portfolio",
  },
  description:
    "Reisel Valle - Ingeniero en Ciencias Informáticas y Fullstack Developer especializado en React, Next.js, Angular, Node.js, Express, TypeScript y Google Cloud Platform. Experiencia creando aplicaciones web escalables para startups en LATAM. Experto en desarrollo ágil, arquitecturas modernas y soluciones cloud.",
  keywords: [
    "Reisel Valle",
    "Fullstack Developer",
    "Ingeniero en Ciencias Informáticas",
    "React Developer",
    "Next.js Developer",
    "Angular Developer",
    "Node.js Developer",
    "TypeScript",
    "JavaScript",
    "Google Cloud Platform",
    "GCP",
    "Desarrollador Web Javascript",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack JavaScript",
    "Cuba Developer",
    "LATAM Developer",
    "Startup Developer",
    "Agile Development",
    "REST APIs",
    "PostgreSQL",
    "MongoDB",
    "TailwindCSS",
    "Express.js",
    "Docker",
    "Cloud Run",
    "Scalable Applications",
    "Web Applications",
    "Portfolio Desarrollador",
  ],
  authors: [{ name: "Reisel Valle Rojas" }],
  creator: "Reisel Valle Rojas",
  publisher: "Reisel Valle Rojas",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  category: "technology",
  classification: "Portfolio",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
