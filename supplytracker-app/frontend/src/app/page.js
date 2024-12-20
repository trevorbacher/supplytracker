"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page () {
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/loggedin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (res.ok && data.loggedIn) {
                    router.push('/dashboard');
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error: ', error);
                // router.push('/login');
            }
        };

        document.title = "BCMB Supply Tracker";
        checkLoginStatus();
    }, [router]);

    return (
        <html>
            <body>
                <div>
                    
                </div>
            </body>
        </html>
    );
};