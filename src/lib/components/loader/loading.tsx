import React from 'react';
import styles from './Loader.module.css'; // CSS module for styling
import Image from 'next/image';
const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className={`${styles.box} ${styles[`box${i}`]}`}>
            <Image src="/e.svg" alt="Admin" height={40} width={60} />
          <div />
        </div>
      ))}
      <div className={styles.ground}>
        <div />
      </div>
    </div>
  );
};

export default Loader;
