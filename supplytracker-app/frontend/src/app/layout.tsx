// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>BCMB SupplyTracker</title>
        {/* You can include more meta tags or links to stylesheets here */}
      </head>
      <body>
        {/* <nav>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav> */}
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
