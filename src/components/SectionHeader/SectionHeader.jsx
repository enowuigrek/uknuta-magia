import { useEffect, useRef } from 'react';
import styles from './SectionHeader.module.scss';

export function SectionHeader({ header, text, className }) {
    const classNames = [styles.sectionHeader, className].filter(Boolean).join(' ');

    const paragraphs = Array.isArray(text) ? text : [text];
    const paraRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.paragraphVisible);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        paraRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [paragraphs.length]);

    return (
        <div className={classNames}>
            {header && <h1>{header}</h1>}
            {paragraphs.map((para, i) => (
                <p
                    key={i}
                    ref={(el) => (paraRefs.current[i] = el)}
                    className={styles.paragraph}
                    style={{ transitionDelay: `${i * 0.12}s` }}
                >
                    {para}
                </p>
            ))}
        </div>
    );
}
