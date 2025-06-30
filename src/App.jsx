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

// Komponent panelu administracyjnego z logowaniem
function AdminRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('adminAuthenticated') === 'true'
    );
    const [adminPassword, setAdminPassword] = useState('');
    const navigate = useNavigate();

    // ZMIEŃ TO HASŁO NA SWOJE!
    const ADMIN_PASSWORD = 'twoje_bezpieczne_haslo_2024';

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminPassword === ADMIN_PASSWORD) {
            localStorage.setItem('adminAuthenticated', 'true');
            setIsAuthenticated(true);
            setAdminPassword('');
        } else {
            alert('Nieprawidłowe hasło!');
            setAdminPassword('');
        }
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        setIsAuthenticated(false);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    // Jeśli nie zalogowany, pokaż formularz logowania
    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6'
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1f2937' }}>
                        Panel Administracyjny
                    </h2>
                    <form onSubmit={handleAdminLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Hasło:
                            </label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                                placeholder="Wprowadź hasło administracyjne"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                marginBottom: '15px'
                            }}
                        >
                            Zaloguj się
                        </button>
                    </form>
                    <button
                        onClick={handleBackClick}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Powrót do strony głównej
                    </button>
                </div>
            </div>
        );
    }

    // Jeśli zalogowany, pokaż panel administracyjny
    return (
        <div>
            <div style={{
                background: '#1f2937',
                color: 'white',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '18px', fontWeight: '500' }}>Panel Administracyjny</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleBackClick}
                        style={{
                            padding: '8px 16px',
                            background: '#374151',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Strona główna
                    </button>
                    <button
                        onClick={handleAdminLogout}
                        style={{
                            padding: '8px 16px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Wyloguj się
                    </button>
                </div>
            </div>
            <AdminPanel />
        </div>
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
                <Route path="/admin" element={<AdminRoute />} />

                {/* Przekierowanie dla nieznanych ścieżek */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App