"use client"

import React from 'react';

export default function ForgotPasswordPage () {
	return (
		<div>
			<h1>Forgot Password Page</h1>
			<form>
				<div>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" name="username" />
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" name="password" />
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};