'use client'

import React, { useEffect } from 'react';
import styles from './page.module.css';

export default function Page () {
	useEffect(() => {
		document.title = 'BCMB Supply Tracker';
	}, []);

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Welcome to the Page!</h1>
			<p className={styles.content}>
				This is the BCMB Supply Tracker dashboard.
			</p>
		</div>
	);
};