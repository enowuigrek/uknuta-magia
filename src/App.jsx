import './App.css'
import {author, bookDescription} from "./content/book.js";
import bookCover from './assets/book-cover.svg';
import authorPhoto from './assets/author-photo.jpg';
import {CursorGlow} from './components/CursorGlow/CursorGlow.jsx'
import {Header} from './components/Header/Header.jsx'
import {Footer} from "./components/Footer/Footer.jsx";
import {ContentSection} from "./components/ContentSection/ContentSection.jsx";

function App() {

  return (
    <>
        <CursorGlow/>
        <Header/>
        <ContentSection
            isPhotoLeft
            img={bookCover}
            header={bookDescription.title}
            text={bookDescription.description}
            alt={'okładka'}
        />
        <ContentSection
            img={authorPhoto}
            header={author.title}
            text={author.description}
            alt={'zdjęcie autora'}/>
        <Footer/>
    </>
  )
}

export default App
