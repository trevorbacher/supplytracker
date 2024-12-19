// src/app/api/auth.ts
import { NextResponse } from 'next/server';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

const users: User[] = [
  { id: 1, email: 'user@example.com', password: 'password', name: 'John Doe' },
  // Add more test users as needed
];

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // You can set up sessions/cookies here as needed
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}

export async function GET() {
  // In a real scenario, retrieve user info based on session/cookie
  // This is a placeholder response for the demo
  return NextResponse.json({ message: 'User data placeholder' });
}
