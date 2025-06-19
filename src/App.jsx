import './App.css'
import {author, bookDescription} from "./content/book.js";
import bookCover from './assets/book-cover.svg';
import authorPhoto from './assets/author-photo.jpg';
import {CursorGlow} from './components/CursorGlow/CursorGlow.jsx'
import {Header} from './components/Header/Header.jsx'
import {ContentSection} from "./components/ContentSection/ContentSection.jsx";
import {Footer} from "./components/Footer/Footer.jsx";
import {TeaserContent} from "./components/TeaserContent/TeaserContent.jsx";

function App() {

    return (
        <>
            <CursorGlow/>
            <Header/>

            {/* Sekcja o książce */}
            <section id="book">
                <ContentSection
                    isPhotoLeft
                    img={bookCover}
                    header={bookDescription.title}
                    text={bookDescription.description}
                    alt={'okładka'}
                />
            </section>

            {/* Sekcja o autorze */}
            <section id="author">
                <ContentSection
                    img={authorPhoto}
                    header={author.title}
                    text={author.description}
                    alt={'zdjęcie autora'}/>
            </section>

            {/*<TeaserContent />*/}
            {/*<Footer />*/}

        </>
    )
}

export default App