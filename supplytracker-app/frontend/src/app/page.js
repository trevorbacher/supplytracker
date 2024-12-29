"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Main Page component
export default function Page () {
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Fetching login status from the server
                const res = await fetch('http://localhost:5000/api/loggedin', {
                    method: 'GET',
                });

                // Parsing the response data
                const data = await res.json();

                // Redirecting based on login status
                if (res.ok && data.loggedIn) {
                    router.push('/dashboard'); // User is logged in
                } else {
                    router.push('/login'); // User is not logged in
                }
            } catch (error) {
                console.error('Error fetching login status: ', error);
                router.push('/login');
            }
        };

        document.title = "BCMB Supply Tracker";
        checkLoginStatus(); // Check login status on component mount
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