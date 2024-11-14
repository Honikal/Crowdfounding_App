import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import styles from '../Styles/ComponentStyles/CategoryContent.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    idUsuario: string,
    nombre: string,
    activa: boolean,
    areaTrabajo: string,
    categorias: string[],
    cedula: string,
    correo: string,
    password: string,
    presupuesto: number,
    role: string,
    telefono: string
}

interface CategoryContentProps {
    categories: string[];
    user: User;
}

function CategoryContent({ categories, user }: CategoryContentProps) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const checkOverflow = () => {
        const container = containerRef.current;
        if (container) {
            setIsOverflowing(container.scrollWidth > container.clientWidth);
        }
    };

    useEffect(() => {
        checkOverflow();
        const handleResize = () => checkOverflow();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [categories.length]);

    const scrollLeft = () => {
        const scrollDistance = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--scroll-distance'));
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const scrollDistance = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--scroll-distance'));
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    };

    const navigateToSection = (category: string) => {
        if (!category) return; // Verifica que la categoría sea válida

        navigate("/search/categories", {
            state: { category, user: { ...user, categorias: user.categorias || [] } }
        });
    };

    return (
        <div className={`${styles.HeaderContainer} ${isOverflowing ? styles.overflowing : ''}`}>
            {isOverflowing && (
                <button className={styles.Scrollbutton} onClick={scrollLeft}>
                    <FaAngleLeft className={styles.ScrollIcon} />
                </button>
            )}
            <div className={`${styles.categoriesContainer} ${!isOverflowing ? styles.spaceBetween : ''}`} ref={containerRef}>
                {categories.map((category, index) => (
                    <div key={index} className={styles.categoryButton} onClick={() => navigateToSection(category)}>
                        {category}
                    </div>
                ))}
            </div>
            {isOverflowing && (
                <button className={styles.Scrollbutton} onClick={scrollRight}>
                    <FaAngleRight className={styles.ScrollIcon} />
                </button>
            )}
        </div>
    );
}

export default CategoryContent;
