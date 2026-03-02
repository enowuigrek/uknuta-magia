import { useEffect, useRef } from 'react';
import { SectionHeader } from "../SectionHeader/SectionHeader.jsx";
import styles from './ContentSection.module.scss'

export function ContentSection({id, isPhotoLeft, stickyImage, stickyText, floatPhoto, img, alt, header, text }) {
    const isSticky = stickyImage || stickyText;
    const floatImgRef = useRef(null);

    useEffect(() => {
        if (!floatPhoto || !floatImgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.floatedImageVisible);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(floatImgRef.current);
        return () => observer.disconnect();
    }, [floatPhoto]);

    // Float layout: zdjęcie pływa po prawej, tekst opływa je po lewej
    if (floatPhoto) {
        return (
            <section id={id} className={styles.floatSection}>
                <img ref={floatImgRef} className={styles.floatedImage} src={img} alt={alt} />
                <SectionHeader header={header} text={text} className={styles.floatText} />
            </section>
        );
    }

    const imageClassName = [
        styles.sectionImage,
        stickyImage ? styles.stickyImage : '',
    ].filter(Boolean).join(' ');

    const textClassName = stickyText ? styles.stickyText : undefined;

    return (
        <section id={id} className={`${styles.contentSection} ${isSticky ? styles.stickySection : ''}`}>
            {isPhotoLeft && img && <img className={imageClassName} src={img} alt={alt} />}
            <SectionHeader header={header} text={text} className={textClassName} />
            {!isPhotoLeft && img && <img className={imageClassName} src={img} alt={alt} />}
        </section>
    );
}
