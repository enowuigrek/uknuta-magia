import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {author, bookDescription} from "./content/book.js";
import bookCover from './assets/book-cover.svg';
import authorPhoto from './assets/author-photo.jpg';
import {CursorGlow} from './components/CursorGlow/CursorGlow.jsx'
import {Header} from './components/Header/Header.jsx'
import {ContentSection} from "./components/ContentSection/ContentSection.jsx";
import {Footer} from "./components/Footer/Footer.jsx";
import {OrderForm} from "./components/OrderForm/OrderForm.jsx";
import {TeaserContent} from "./components/TeaserContent/TeaserContent.jsx";
import {AdminPanel} from "./components/AdminPanel/AdminPanel.jsx";
import {Section} from "lucide-react";
import {SectionHeader} from "@/components/SectionHeader/SectionHeader.jsx";
// import BookCharacterChat from "@/components/Chat/BookCharacterChat.jsx";

// Komponent strony głównej
function HomePage() {
    const navigate = useNavigate();

    const handleOrderClick = () => {
        navigate('/zamowienie');
    };

    return (
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
            <ContentSection text={author.descriptionContinue}/>
            {/*<BookCharacterChat/>*/}
            {/*<TeaserContent />*/}
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

    return <OrderForm show={true} onBack={handleBackClick} />;
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
        </Router>
    );
}

export default App