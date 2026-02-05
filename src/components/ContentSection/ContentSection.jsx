import {SectionHeader} from "../SectionHeader/SectionHeader.jsx";
import styles from './ContentSection.module.scss'

export function ContentSection({id, isPhotoLeft, stickyImage, stickyText, img, alt, header, text }) {
    const isSticky = stickyImage || stickyText;

    const imageClassName = stickyImage
        ? `${styles.sectionImage} ${styles.stickyImage}`
        : styles.sectionImage;

    const textClassName = stickyText ? styles.stickyText : undefined;

    return (
        <section id={id} className={`${styles.contentSection} ${isSticky ? styles.stickySection : ''}`}>
            {isPhotoLeft && img && <img className={imageClassName} src={img} alt={alt} />}
            <SectionHeader header={header} text={text} className={textClassName} />
            {!isPhotoLeft && img && <img className={imageClassName} src={img} alt={alt} />}
        </section>
    );
}
