

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
                    <main>{children}</main>
                </div>
            </body>
        </html>
    );
};