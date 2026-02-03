import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XYPHER // INTELLIGENCE ARCHIVE",
  description: "India Crime Intelligence Archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
