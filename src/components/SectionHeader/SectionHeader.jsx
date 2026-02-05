import styles from './SectionHeader.module.scss';

export function SectionHeader({ header, text }) {

    return (
        <div className={styles.sectionHeader} >
            {header && <h1> {header}</h1>}
            <p>{text}</p>
        </div>
    );
}