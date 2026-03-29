import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Gusto House — Workspace & Studio | Collingham, Nottinghamshire',
  description: 'A cutting-edge workspace and thriving community venue in Collingham, Nottinghamshire. Co-working hot desks, training room, meeting room, and studio hire.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
