import type { Metadata } from "next";
import { Work_Sans} from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans({
  subsets:['latin'],
  variable:'--font-work-sans',
  weight:['400','600','700']
});

export const metadata: Metadata = {
  title: "Figma Clone",
  description: "A minimalist figma clone using the fabric js for real time collabration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-primary-grey-200 ${workSans.className}`}>
        <Room>
        {children}
        </Room>
        </body>
    </html>
  );
}
