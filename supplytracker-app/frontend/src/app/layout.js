import { AuthProvider } from '../context/AuthContext';

// RootLayout component that wraps the application
export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                {/* AuthProvider wraps the children to provide authentication context */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
} 