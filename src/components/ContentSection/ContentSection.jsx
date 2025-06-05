import {SectionHeader} from "../SectionHeader/SectionHeader.jsx";
import styles from './ContentSection.module.scss'

export function ContentSection({isPhotoLeft, img, alt, header, text}) {

    return (
    <div className={styles.content_section}>
        {isPhotoLeft && <img className={styles.section_image} src={img} alt={alt}/>}
        <SectionHeader header={header} text={text}/>
        {!isPhotoLeft && <img className={styles.section_image} src={img} alt={alt}/>}
    </div>
  )
}
