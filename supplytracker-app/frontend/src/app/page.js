'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Main Page component
export default function Page () {
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {

                const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
                // Fetching login status from the server
                const res = await fetch(`${backendURL}/api/loggedin`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch login status');
                }
        
                // Parse the response as the raw value (true/false)
                const loggedIn = await res.json();
                console.log('loggedIn: ', loggedIn);

                //Redirect based on login status
                if (loggedIn === true) {
                    router.push('/dashboard'); // User is logged in
                } else {
                    router.push('/login'); // User is not logged in
                }
                
            } catch (error) {
                console.error('Error fetching login status: ', error);
                console.log('Error fetching login status: ', error),
                // router.push('/login');
            }
        };

        document.title = 'BCMB Supply Tracker';
        checkLoginStatus(); // Check login status on component mount
    }, [router]);

    return (
        <div>
            
        </div>
    );
};