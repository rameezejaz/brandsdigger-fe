// src/components/Header/Header.tsx
import React, { useState } from 'react';
import styles from './Header.module.css'; 
import logo from '../../assets/images/brands-digger-logo.webp'
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className="container">
        <div className="row">
            <div className="col-5">
                <div className="d-flex justify-content-start">
                    <Link to="/" className='text-docoration-none'>
                        <img src={logo} alt='Brands Digger Logo' className={`${styles.logo}`} />
                    </Link>
                </div>
            </div>
            <div className="col-7 d-flex align-items-center justify-content-end">
                <div className={styles.navbar}>
                    <nav className={styles.nav}>
                        <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
                            <span className={styles.bar}></span>
                            <span className={styles.bar}></span>
                            <span className={styles.bar}></span>
                        </div>

                        <div className={`${styles.navBox} ${isOpen ? styles.open : ""}`}>
                            <ul className={styles.navLinks}>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Portfolio</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
