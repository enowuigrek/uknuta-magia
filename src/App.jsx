import { useState } from 'react';
import {author, bookDescription} from "./content/book.js";
import bookCover from './assets/book-cover.svg';
import authorPhoto from './assets/author-photo.jpg';
import {CursorGlow} from './components/CursorGlow/CursorGlow.jsx'
import {Header} from './components/Header/Header.jsx'
import {ContentSection} from "./components/ContentSection/ContentSection.jsx";
import {Footer} from "./components/Footer/Footer.jsx";
import {OrderForm} from "./components/OrderForm/OrderForm.jsx";
import {TeaserContent} from "./components/TeaserContent/TeaserContent.jsx";
import BookCharacterChat from "@/components/Chat/BookCharacterChat.jsx";

function App() {
    const [showOrderForm, setShowOrderForm] = useState(false);

    const handleOrderClick = () => {
        setShowOrderForm(true);
    };

    const handleBackClick = () => {
        setShowOrderForm(false);
    };

    return (
        <>
            {showOrderForm ? (
                <OrderForm show={true} onBack={handleBackClick} />
            ) : (
                <>
                    <CursorGlow />
                    <Header onOrderClick={handleOrderClick} />
                    <ContentSection
                        id="book"
                        isPhotoLeft
                        img={bookCover}
                        header={bookDescription.title}
                        text={bookDescription.description}
                        alt={'okładka'}
                    />
                    <ContentSection
                        id="author"
                        img={authorPhoto}
                        header={author.title}
                        text={author.description}
                        alt={'zdjęcie autora'}
                    />
                    {/*<BookCharacterChat/>*/}
                    {/*<TeaserContent />*/}
                    <Footer />
                </>
            )}
        </>
    );
}
export default App