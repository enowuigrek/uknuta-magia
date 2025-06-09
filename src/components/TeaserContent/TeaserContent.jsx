import styles from './TeaserContent.module.scss'

export function TeaserContent() {
    return (
        <div className={styles.teaser_content}>
            <p>
                Niech pierwsze słowa otworzą drzwi do świata magii.
            </p>
            <p>
                Zostaw wiadomość na <a href="mailto:kontakt@uknutamagia.pl">kontakt@uknutamagia.pl</a>,
                a otrzymasz pierwszy rozdział „Uknutej Magii” prosto do swojej skrzynki.
            </p>
        </div>
    )
}