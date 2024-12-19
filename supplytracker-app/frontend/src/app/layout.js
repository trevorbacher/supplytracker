import React from 'react';
import './globals.css';
import './layout.css';

const Layout = ({ children }) => {
    return (
        <html lang="en">
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
