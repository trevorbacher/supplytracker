

import React from 'react';
import Head from 'next/head';
import '../globals.css';
import './layout.css';

export default function Layout ({ children }) {
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