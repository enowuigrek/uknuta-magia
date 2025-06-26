import { useEffect, useRef, useState } from 'react';
import styles from './SectionHeader.module.scss';

export function SectionHeader({ header, text }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`${styles.sectionHeader} ${isVisible ? styles.visible : ''}`}>
            <h1>{header}</h1>
            <p>{text}</p>
        </div>
    );
}