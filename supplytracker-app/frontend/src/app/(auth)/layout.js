import React from 'react';
import '../globals.css';
import './layout.css';

// AuthLayout component that wraps authentication-related pages
export default function AuthLayout({ children }) {
    return (
        <div className='auth-layout'>
            {children}
        </div>
    );
}