import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {author, bookDescription} from "./content/book.js";
import bookCover from './assets/book-cover.svg';
import authorPhoto from './assets/author-photo.jpg';
import {CursorGlow} from './components/CursorGlow/CursorGlow.jsx'
import {MagicMist} from './components/MagicMist/MagicMist.jsx'
import {MagicParticles} from './components/MagicParticles/MagicParticles.jsx'
import {Header} from './components/Header/Header.jsx'
import {ContentSection} from "./components/ContentSection/ContentSection.jsx";
import {Footer} from "./components/Footer/Footer.jsx";
import {OrderForm} from "./components/OrderForm/OrderForm.jsx";
import {AdminPanel} from "./components/AdminPanel/AdminPanel.jsx";
import {CookieBanner} from "./components/CookieBanner/CookieBanner.jsx";
// import BookCharacterChat from "@/components/Chat/BookCharacterChat.jsx";

// Komponent strony głównej
function HomePage() {
    const navigate = useNavigate();

    const handleOrderClick = () => {
        navigate('/zamowienie');
    };

    return (
        <>
            <MagicMist />
            <MagicParticles />
            <CursorGlow />
            <Header onOrderClick={handleOrderClick} />
            <ContentSection
                id="book"
                isPhotoLeft
                stickyText
                img={bookCover}
                header={bookDescription.title}
                text={bookDescription.description}
                alt={'okładka'}
            />
            <ContentSection
                id="author"
                stickyImage
                img={authorPhoto}
                header={author.title}
                text={author.description}
                alt={'zdjęcie autora'}
            />
            <Footer />
        </>
    );
}

// Komponent formularza zamówienia
function OrderPage() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <>
            <MagicMist />
            <MagicParticles />
            <CursorGlow />
            <OrderForm show={true} onBack={handleBackClick} />
        </>
    );
}

// Główny komponent App z routingiem
function App() {
    return (
        <Router>
            <Routes>
                {/* Strona główna */}
                <Route path="/" element={<HomePage />} />

                {/* Formularz zamówienia */}
                <Route path="/zamowienie" element={<OrderPage />} />

                {/* Panel administracyjny */}
                <Route path="/admin" element={<AdminPanel />} />

                {/* Przekierowanie dla nieznanych ścieżek */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <CookieBanner />
        </Router>
    );
}

export default App