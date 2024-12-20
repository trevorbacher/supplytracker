"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page () {
    const router = useRouter();

    useEffect(() => {
        document.title = "BCMB Supply Tracker";
        router.push('/dashboard');
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