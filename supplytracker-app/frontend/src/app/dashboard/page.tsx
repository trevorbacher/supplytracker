// src/app/dashboard/page.tsx
"use client"; // This directive marks the component as a client component

import { useEffect, useState } from 'react';

interface UserData {
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/auth');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {userData ? (
        <div>
          <h2>Welcome, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
          {/* Add more user data display as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
