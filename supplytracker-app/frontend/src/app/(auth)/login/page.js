"use client"

import { useState } from "react";
import React from 'react';
import styles from './page.module.css'
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch('/api/login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				if (rememberMe) {
					localStorage.setItem('authToken', data.token);
				}
				window.location.href = '/dashboard';
			} else {
                console.error('Login failed:', data.message);
            }
		} catch (error) {
			console.error('Error: ', error);
		}
	};

	return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <form onSubmit={handleLogin}>
          <h1 className={styles['login-title']}>Login</h1>
          <div className={styles['input-box']}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles['input-box']}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />  
          </div>
          <div className={styles.togglePasswordContainer}>
            <button 
              className={styles.togglePassword}
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide Password' : 'Show Password'}  
            </button>
          </div>
          <div className={styles['remember-forget']}>
            <label>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                />
              Remember me
            </label>
            <a href="/forgot-password"> Forgot password?</a>
          </div>
          <button type="submit" className={styles.btn}>Login</button>
          <div className={styles['register-link']}>
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};