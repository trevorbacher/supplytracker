import React from 'react';
import Head from 'next/head';
import '../globals.css';
import './layout.css';

export default function AuthLayout({ children }) {
    return (
        <div className="auth-layout">
            {children}
        </div>
    );
}