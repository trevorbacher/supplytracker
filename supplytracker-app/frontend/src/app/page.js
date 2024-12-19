import React from 'react';
import styles from './page.module.css';

const Page = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to the Page!</h1>
            <p className={styles.content}>
                This is a specific page with its own styles.
            </p>
        </div>
    );
};

export default Page;