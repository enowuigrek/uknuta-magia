import { useEffect, useRef } from 'react';
import styles from './CursorGlow.module.scss';

export function CursorGlow() {
    const glowRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (glowRef.current) {
                glowRef.current.style.left = `${e.clientX}px`;
                glowRef.current.style.top = `${e.clientY}px`;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            className={styles.cursorGlow}
            ref={glowRef}
        />
    );
};