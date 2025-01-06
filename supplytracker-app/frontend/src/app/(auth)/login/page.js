'use client'

import { useState, useEffect } from 'react';
import React from 'react';
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') === 'true');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }

    try {

      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const res = await fetch(`${backendURL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (rememberMe && data.data.token) {
          localStorage.setItem('authToken', data.data.token);
        }
        window.location.href = '/dashboard';
      } else {
        setErrorMessage('Invalid username or password');
        // console.error('Resolution was okay or !data.success:', error);
      }
    } catch (error) {
      
      setErrorMessage('Network error. Please try again');
    }
  };

  useEffect(() => {
    return () => {
      if (!rememberMe) {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }
    };
  }, [rememberMe]);

  return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <form onSubmit={handleLogin}>
          <h1 className={styles['login-title']}>Login</h1>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <div className={styles['input-box']}>
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles['input-box']}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
          </div>
          <div className={styles.togglePasswordContainer}>
            <button
              className={styles.togglePassword}
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>
          <div className={styles['remember-forget']}>
            <label>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href='/forgot-password'> Forgot password?</a>
          </div>
          <button type='submit' className={styles.btn}>Login</button>
          <div className={styles['register-link']}>
            <p>Don't have an account? <a href='/register'>Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};