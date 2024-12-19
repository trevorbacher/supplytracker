// layout.js
import React from 'react';
import Head from 'next/head'; // Import Head from Next.js
import './globals.css';
import './layout.css';

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <Head>
                <title>Supply Tracker</title>
                <meta name="description" content="Your page description" />
            </Head>
            <body>
                <div className="layout">
                    <header>
                        <nav>
                            {/* Navigation links can go here */}
                        </nav>
                    </header>
                    <main>{children}</main>
                    <footer>
                        <p>&copy; {new Date().getFullYear()} UTK BCMB Supply Tracker. All rights reserved.</p>
                    </footer>
                </div>
            </body>
        </html>
    );
};

export default Layout;
