"use client"

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import '../globals.css';
import './layout.css';
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState({ photo: '' });
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetch(`${backendURL}/api/user`, {
            credentials: 'include', // Includes cookies in the request
        })
        .then(response => {
            if (!response.ok) throw new Error('Not authenticated');
            return response.json();
        })
        .then(userData => {
            setUser(userData);
        })
        .catch(() => {
            router.push('/login');
        });
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        fetch(`${backendURL}/api/logout`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(() => {
            router.push('/login');
        })
        .catch((error) => {
            console.error('Logout failed:', error);
        });
        setMenuOpen(false);
    };

    return (
        <>
            <Head>
                <title>Supply Tracker</title>
                <meta name='description' content='Your page description' />
            </Head>
            <div className='layout'>
                <header>
                    <nav>
                        <button 
                            className="menu-button" 
                            style={{ backgroundImage: `url(${user.photo})` }}
                            onClick={toggleMenu}
                        />
                    </nav>
                </header>
                <main>{children}</main>
                <footer>
                    <p>&copy; {new Date().getFullYear()} UTK BCMB Supply Tracker. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
};