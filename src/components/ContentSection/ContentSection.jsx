import bookCover from '../../assets/book-cover.svg'
import {SectionHeader} from "../SectionHeader/SectionHeader.jsx";
import {bookDescription} from "../../content/book.js";
import styles from './ContentSection.module.scss'

export function ContentSection() {
  return (
    <div className={styles.content_section}>
      <img className={styles.section_image} src={bookCover} alt="book cover" />
        <SectionHeader header={bookDescription.title} text={bookDescription.description}/>
    </div>
  )
}
