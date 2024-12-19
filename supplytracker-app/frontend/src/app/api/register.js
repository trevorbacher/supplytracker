// src/pages/api/register.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Here you would normally hash the password and save the user to a database
    // For example:
    // const hashedPassword = await hashPassword(password);
    // await saveUserToDatabase({ email, password: hashedPassword });

    // Simulating a successful registration
    return res.status(200).json({ message: 'User registered successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
