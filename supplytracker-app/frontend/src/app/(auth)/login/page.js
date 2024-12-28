"use client"

import { useState, useEffect } from "react";
import React from 'react';
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const rememberedEmail = document.cookie
        .split('; ')
        .find(row => row.startsWith('rememberedEmail='))
        ?.split('=')[1];

    if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true); // Automatically check the "Remember Me" box
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }

    try {
      const res = await fetch('https://supplytracker.vercel.app/api/login', {
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
        setAlert({
          show: true,
          message: data.message || 'Login failed. Please check your credentials.',
          type: 'error'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'Network error. Please try again later.',
        type: 'error'
      });
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

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <form onSubmit={handleLogin}>
          <h1 className={styles['login-title']}>Login</h1>
          
          {alert.show && (
            <div className={`${styles.alert} ${styles[alert.type]}`}>
              {alert.message}
            </div>
          )}

          <div className={styles['input-box']}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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