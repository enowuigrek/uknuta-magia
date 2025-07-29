import {SectionHeader} from "../SectionHeader/SectionHeader.jsx";
import styles from './ContentSection.module.scss'

export function ContentSection({id, isPhotoLeft, img, alt, header, text }) {
    return (
        <section id={id} className={styles.contentSection}>
            {isPhotoLeft && <img className={styles.sectionImage} src={img} alt={alt} />}
            <SectionHeader header={header} text={text} />
            {!isPhotoLeft && <img className={styles.sectionImage} src={img} alt={alt} />}
        </section>
    );
}
