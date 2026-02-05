import styles from './SectionHeader.module.scss';

export function SectionHeader({ header, text, className }) {
    const classNames = [styles.sectionHeader, className].filter(Boolean).join(' ');

    return (
        <div className={classNames}>
            {header && <h1> {header}</h1>}
            <p>{text}</p>
        </div>
    );
}