# Uknuta Magia - Development Documentation

## 🎯 Cel projektu
Profesjonalna strona sprzedażowa dla książki dziecięcej **"Uknuta Magia"** autorstwa Adriana Knuta, z pełnym systemem zarządzania zamówieniami i panelem administracyjnym.

## ✅ AKTUALNY STAN

### 🎉 **SYSTEM W PRODUKCJI:**
- **Live e-commerce:** https://uknutamagia.pl ✅ **DZIAŁAJĄCY SKLEP**
- **Własna domena:** Profesjonalna obecność biznesowa ✅
- **SSL Certificate:** Bezpieczne transakcje ✅
- **Prawdziwe zamówienia:** Aktywna sprzedaż książek ✅
- **System płatności:** BLIK + przelewy tradycyjne ✅
- **Panel administracyjny:** Zarządzanie zamówieniami na żywo ✅
- **Email notifications:** Automatyczne powiadomienia działają ✅
- **SEO optimization:** Comprehensive meta tags, JSON-LD ✅
- **Custom favicon:** Złote "U" w kolorach marki ✅
- **RODO compliance:** Cookie banner z localStorage consent ✅
### 🔧 **TECHNICZNE PODSTAWY:**
- **Setup techniczny:** Vite + React + SCSS Modules ✅
- **Hosting:** Netlify z własną domeną ✅
- **Deployment:** CI/CD pipeline działający ✅
- **System zamówień:** Pełna funkcjonalność e-commerce ✅
- **Panel administracyjny:** Zarządzanie zamówieniami i statystyki ✅
- **Integracja z bazą danych:** Supabase PostgreSQL ✅
- **System emaili:** EmailJS - automatyczne powiadomienia ✅
- **Responsywny design:** Mobile-first approach ✅
- **Walidacja formularzy:** Real-time validation ✅
- **Opcje dostawy:** Odbiór osobisty, paczkomat, kurier ✅
- **Instrukcje płatności:** BLIK + przelewy tradycyjne ✅
- **Utils & Hooks foundation:** Nowoczesna architektura React ✅

### 🔧 Tech stack:
```json
{
  "frontend": "React 18 + Vite",
  "styling": "SCSS Modules", 
  "database": "Supabase (PostgreSQL)",
  "emails": "EmailJS",
  "routing": "React Router DOM",
  "icons": "lucide-react",
  "language": "JavaScript/JSX"
}
```

## 🏗️ **AKTUALNA STRUKTURA PROJEKTU**

```
src/
├── components/
│   ├── AdminPanel/
│   │   ├── AdminPanel.jsx (500+ linii - DO REFAKTORYZACJI)
│   │   └── AdminPanel.module.scss
│   ├── OrderForm/
│   │   ├── OrderForm.jsx (400+ linii - DO REFAKTORYZACJI)
│   │   └── OrderForm.module.scss
│   ├── Chat/
│   │   ├── BookCharacterChat.jsx (300+ linii - OPCJONALNE)
│   │   └── BookCharacterChat.module.scss
│   ├── Header/ (Header.jsx, Header.module.scss)
│   ├── Footer/ (Footer.jsx, Footer.module.scss)
│   ├── ContentSection/ (ContentSection.jsx, ContentSection.module.scss)
│   ├── SectionHeader/ (SectionHeader.jsx, SectionHeader.module.scss)
│   ├── CursorGlow/ (CursorGlow.jsx, CursorGlow.module.scss)
│   └── TeaserContent/ (TeaserContent.jsx, TeaserContent.module.scss)
│   ├── CookieBanner/ ✅ NOWE
│   │   ├── CookieBanner.jsx (RODO compliance)
│   │   └── CookieBanner.module.scss
├── assets/
│   ├── book-cover.svg (okładka książki)
│   ├── author-photo.jpg (zdjęcie autora)
│   └── screenshots/ ✅ NOWE
│       └── homepage-screenshot.png (screenshot strony)
├── hooks/ ✅ GOTOWE
│   ├── useAuth.js (admin authentication)
│   ├── useFormValidation.js (real-time validation)
│   ├── useLocalStorage.js (storage management)
│   ├── useOrderForm.js (order logic)
│   ├── useOrders.js (orders & stats)
│   └── index.js
├── utils/ ✅ GOTOWE
│   ├── api.js (Supabase operations)
│   ├── constants.js (prices, delivery options)
│   ├── email.js (EmailJS integration)
│   ├── formatters.js (data formatting)
│   ├── priceCalculations.js (pricing logic)
│   ├── validation.js (form validation)
│   └── index.js
├── config/supabase.js
├── content/book.js
├── styles/ (index.scss, variables.scss)
└── App.jsx
```

## 🆕 **ETAP 1: FUNDAMENTY** ✅ **ZAKOŃCZONY**

### **Utworzone pliki:**
- **src/utils/** - 6 plików z logiką biznesową
- **src/hooks/** - 5 custom hooks React
- **index.js** - łatwy import wszystkich funkcji

### **Korzyści:**
- **Separacja logiki** - business logic oddzielona od UI
- **Reużywalność** - funkcje mogą być używane w różnych komponentach
- **Łatwiejsze testowanie** - każda funkcja jest niezależna
- **Lepsze zarządzanie stanem** - custom hooks dla React patterns

## 🎯 **Current Features**

### 1. **Landing Page** ⭐
- **Book showcase** - okładka, opis, biografia autora
- **Responsywny design** - mobile-first approach
- **Cursor glow effect** - nowoczesny efekt wizualny
- **Smooth scrolling** - nawigacja między sekcjami

### 2. **System Zamówień** ⭐
- **3 opcje dostawy:**
  - Odbiór osobisty (0 zł) - Częstochowa/Raciszyn
  - Paczkomat InPost (16.99 zł)
  - Wysyłka kurierska (19.99 zł)
- **Dynamiczne ceny** - książka 49.99 zł + dostawa
- **Walidacja formularza** - real-time validation
- **Email powiadomienia** - klient + admin

### 3. **Panel Administracyjny** ⭐
- **Secure login** - hasło chronione
- **Orders management** - filtrowanie, aktualizacja statusów
- **Statistics dashboard** - przychody, sprzedaż, koszty
- **Mobile responsive** - tabela desktop, karty mobile
- **Real-time updates** - live order changes

### 4. **Integracje** ⭐
- **Supabase database** - PostgreSQL backend
- **EmailJS** - automatyczne emaile
- **BLIK payments** - instrukcje płatności
- **Social media** - Instagram, Facebook links

## 📊 **Business Metrics**

### **Pricing Structure:**
- **Książka:** 49.99 zł
- **Odbiór osobisty:** 0.00 zł (Częstochowa/Raciszyn)
- **Paczkomat InPost:** 16.99 zł
- **Kurier:** 19.99 zł

### **Order Statuses:**
- **awaiting_payment** - Złożone (pomarańczowy)
- **paid** - Opłacone (zielony)
- **shipped** - Wysłane (niebieski)
- **delivered** - Dostarczone (zielony ciemny)
- **cancelled** - Anulowane (czerwony)

### **Payment Methods:**
- **BLIK** - przelew na telefon 883 348 381
- **Przelew tradycyjny** - PKO BP: 48 1020 1664 0000 3402 0185 2193
- **Gotówka** - przy odbiorze osobistym

## 🛠️ Development setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

**Live Website:** https://uknutamagia.pl ✅ **ACTIVE E-COMMERCE**

---

## 🚀 **TODO - PLAN REFAKTORYZACJI - SZCZEGÓŁY DLA NOWEGO DEWELOPERA**

### **🎯 PROBLEM DO ROZWIĄZANIA:**
Projekt ma 3 bardzo duże komponenty które są trudne w utrzymaniu:
- **AdminPanel.jsx** - 500+ linii kodu
- **OrderForm.jsx** - 400+ linii kodu
- **BookCharacterChat.jsx** - 300+ linii kodu (opcjonalnie)

**CEL:** Podzielić każdy na 6-8 mniejszych komponentów (50-80 linii każdy)

### **📋 DOSTĘPNE NARZĘDZIA:**
Stworzono już **fundament** w postaci:
- **src/utils/** - 6 plików z logiką biznesową
- **src/hooks/** - 5 custom hooks React
- **Commit:** `e625733` - "feat: add utils and hooks infrastructure"

**Te narzędzia można wykorzystać do refaktoryzacji!**

---

### **🎯 ETAP 2: AdminPanel Refactoring (PRIORYTET 1)**
**Cel:** Podzielić AdminPanel (500+ linii) na mniejsze komponenty

#### **📁 Docelowa struktura:**
```
src/components/AdminPanel/
├── AdminPanel.jsx (główny kontener - ~50 linii)
├── AdminPanel.module.scss
├── components/
│   ├── LoginForm/ ✅ ROZPOCZĘTY (ale nie dokończony)
│   │   ├── LoginForm.jsx (ekran logowania)
│   │   └── LoginForm.module.scss
│   ├── AdminHeader/
│   │   ├── AdminHeader.jsx (header z nawigacją i wylogowaniem)
│   │   └── AdminHeader.module.scss
│   ├── OrderFilters/
│   │   ├── OrderFilters.jsx (filtry: status, refresh button)
│   │   └── OrderFilters.module.scss
│   ├── StatsCards/
│   │   ├── StatsCards.jsx (4 karty statystyk)
│   │   └── StatsCards.module.scss
│   ├── OrdersTable/
│   │   ├── OrdersTable.jsx (desktop table view)
│   │   └── OrdersTable.module.scss
│   └── OrdersMobile/
│       ├── OrdersMobile.jsx (mobile cards view)
│       └── OrdersMobile.module.scss
```

#### **🔧 Wykorzystaj gotowe hooks:**
- `useAuth()` - uwierzytelnianie admina
- `useOrders()` - pobieranie i zarządzanie zamówieniami
- `useOrderStats()` - obliczanie statystyk
- Funkcje z `utils/formatters.js` - formatowanie danych

#### **📝 Kroki do wykonania:**
1. **Dokończ LoginForm** - jest rozpoczęty ale nie zintegrowany
2. **AdminHeader** - wydziel header z przyciskami (home, logout)
3. **OrderFilters** - wydziel sekcję filtrów
4. **StatsCards** - wydziel karty statystyk
5. **OrdersTable + OrdersMobile** - podziel wyświetlanie zamówień
6. **Zintegruj w AdminPanel.jsx** - główny kontener

**Szacowany czas:** 2-3 dni  
**Rezultat:** 500+ linii → 6 komponentów po ~50-80 linii każdy

---

### **🎯 ETAP 3: OrderForm Refactoring (PRIORYTET 2)**
**Cel:** Podzielić OrderForm (400+ linii) na komponenty funkcjonalne

#### **📁 Docelowa struktura:**
```
src/components/OrderForm/
├── OrderForm.jsx (główny kontener + routing statusów)
├── components/
│   ├── BookInfo/
│   │   ├── BookInfo.jsx (okładka + cena książki)
│   │   └── BookInfo.module.scss
│   ├── ContactForm/
│   │   ├── ContactForm.jsx (imię, email, telefon)
│   │   └── ContactForm.module.scss
│   ├── DeliveryOptions/
│   │   ├── DeliveryOptions.jsx (3 opcje dostawy)
│   │   └── DeliveryOptions.module.scss
│   ├── AddressForm/
│   │   ├── AddressForm.jsx (adres dla kuriera)
│   │   └── AddressForm.module.scss
│   ├── OrderSummary/
│   │   ├── OrderSummary.jsx (podsumowanie cen)
│   │   └── OrderSummary.module.scss
│   ├── PaymentInstructions/
│   │   ├── PaymentInstructions.jsx (ekran po złożeniu)
│   │   └── PaymentInstructions.module.scss
│   └── SuccessScreen/
│       ├── SuccessScreen.jsx (potwierdzenie płatności)
│       └── SuccessScreen.module.scss
```

#### **🔧 Wykorzystuj gotowe narzędzia:**
- `useOrderForm()` - główna logika formularza
- `useFormValidation()` - walidacja w czasie rzeczywistym
- Funkcje z `utils/validation.js` - reguły walidacji
- Funkcje z `utils/priceCalculations.js` - obliczenia cen
- Funkcje z `utils/email.js` - wysyłanie emaili

#### **📝 Kroki do wykonania:**
1. **BookInfo** - wydziel sekcję z okładką i ceną
2. **ContactForm** - pola: imię, email, telefon
3. **DeliveryOptions** - 3 radio buttons z opcjami
4. **AddressForm** - conditional render dla kuriera
5. **OrderSummary** - podsumowanie z cenami
6. **PaymentInstructions** - ekran z instrukcjami płatności
7. **SuccessScreen** - ekran po opłaceniu
8. **Zintegruj z useOrderForm** - zarządzanie stanem

**Szacowany czas:** 2-3 dni  
**Rezultat:** 400+ linii → 7 komponentów po ~40-60 linii każdy

---

### **🎯 ETAP 4: BookCharacterChat Refactoring (OPCJONALNIE)**
**Status:** MOŻE BYĆ POMINIĘTY jeśli chat nie jest używany

#### **📁 Docelowa struktura:**
```
src/components/Chat/
├── BookCharacterChat.jsx (kontener)
├── components/
│   ├── ChatHeader/ (header z wyborem postaci)
│   ├── MessageList/ (lista wiadomości)
│   ├── Message/ (pojedyncza wiadomość)
│   ├── TypingIndicator/ (wskaźnik pisania)
│   └── ChatInput/ (input + wysyłanie)
├── data/characters.js (gotowe w constants.js)
├── hooks/useChat.js
└── utils/responseGenerator.js
```

**Szacowany czas:** 1-2 dni (jeśli potrzebny)

---

### **🎯 ETAP 5: Styles & Performance Optimization (FINALIZACJA)**
**Cel:** Reorganizacja stylów i optymalizacja

#### **📝 Tasks:**
- **Mixins SCSS** - wspólne style komponentów
- **Variables update** - nowe komponenty
- **Bundle optimization** - lazy loading
- **Performance audit** - Core Web Vitals
- **SEO final check** - meta tags, structured data

**Szacowany czas:** 1 dzień

---

## 💡 **HARMONOGRAM ROZWOJU**

### **Tydzień 1: AdminPanel (Status: DO ROZPOCZĘCIA)**
- **Dzień 1:** ✅ Etap 1 - Fundamenty (utils + hooks) **GOTOWE**
- **Dzień 2-3:** LoginForm, AdminHeader, OrderFilters
- **Dzień 4:** StatsCards, OrdersTable, OrdersMobile
- **Dzień 5:** Integracja i testy AdminPanel

### **Tydzień 2: OrderForm**
- **Dzień 1-2:** BookInfo, ContactForm, DeliveryOptions
- **Dzień 3:** AddressForm, OrderSummary
- **Dzień 4:** PaymentInstructions, SuccessScreen
- **Dzień 5:** Integracja i testy OrderForm

### **Tydzień 3: Finalizacja**
- **Dzień 1:** BookCharacterChat (jeśli potrzebny)
- **Dzień 2:** Styles optimization
- **Dzień 3:** Performance & SEO
- **Dzień 4-5:** Testing, deployment, dokumentacja

---

## 🎯 **OCZEKIWANE REZULTATY**

### **Code Quality Improvement:**
- **AdminPanel:** 500+ linii → 6 komponentów (~50-80 linii każdy) = **75% redukcja**
- **OrderForm:** 400+ linii → 7 komponentów (~40-60 linii każdy) = **78% redukcja**
- **BookCharacterChat:** 300+ linii → 6 komponentów (~30-50 linii każdy) = **80% redukcja**

### **Maintainability Benefits:**
- **Single responsibility** - każdy komponent ma jedną funkcję
- **Reusable components** - możliwość ponownego wykorzystania
- **Easy testing** - komponenty łatwe do testowania
- **Better performance** - lazy loading, optymalizacja re-renderów
- **Team collaboration** - różne osoby mogą pracować nad różnymi komponentami

### **Developer Experience:**
- **Faster development** - łatwiejsze dodawanie nowych funkcji
- **Better debugging** - błędy łatwiejsze do zlokalizowania
- **Clear structure** - nowi developerzy szybko się orientują
- **Modern React patterns** - custom hooks, utils separation

---

## 📋 **INSTRUKCJE DLA NOWEGO DEWELOPERA**

### **🚀 Jak rozpocząć:**
1. **Sklonuj repo i uruchom:** `npm install && npm run dev`
2. **Zapoznaj się z utils/hooks:** sprawdź pliki w `src/utils/` i `src/hooks/`
3. **Przeanalizuj obecne komponenty:** `AdminPanel.jsx`, `OrderForm.jsx`
4. **Rozpocznij od Etapu 2:** AdminPanel refactoring

### **🔧 Gotowe narzędzia do wykorzystania:**
- **useAuth()** - logowanie admina
- **useOrders()** - zarządzanie zamówieniami
- **useFormValidation()** - walidacja formularzy
- **formatters.js** - formatowanie danych
- **validation.js** - reguły walidacji
- **constants.js** - wszystkie stałe projektu

### **📝 Reguły kodowania:**
- **Single responsibility** - jeden komponent = jedna funkcja
- **SCSS Modules** - style w osobnych plikach .module.scss
- **Custom hooks** - logika biznesowa w hooks
- **Utils functions** - funkcje pomocnicze w utils/
- **Commit messages** - format: "feat/fix/refactor: description"

### **⚠️ Ważne informacje:**
- **Nie używaj localStorage/sessionStorage** - nie działają w artifacts Claude
- **Wykorzystuj istniejące hooks** - nie przepisuj logiki od nowa
- **Zachowuj obecną funkcjonalność** - to live e-commerce system!
- **Testuj na uknutamagia.pl** - sprawdzaj czy wszystko działa

---

## 📞 **Kontakt Techniczny**
**Developer:** enowuigrek@gmail.com  
**Business:** uknutamagia@gmail.com | 883 348 381  
**GitHub:** github.com/enowuigrek/uknuta-magia  
**Location:** Częstochowa, Polska

---

## 📈 **Ostatnie zmiany (Current Session)**

### ✅ **Etap 1: Fundamenty - ZAKOŃCZONY**
- **Utworzono src/utils/** - 6 plików z logiką biznesową
- **Utworzono src/hooks/** - 5 custom hooks React
- **Dodano index.js** - łatwy import funkcji
- **Commit:** `e625733` - "feat: add utils and hooks infrastructure"

### 🔄 **Etap 2: AdminPanel - W TOKU**
- **LoginForm** - rozpoczęty (przerwany dla dokumentacji)
- **Następny krok:** AdminHeader, OrderFilters

### 📝 **Dokumentacja - ZAKOŃCZONA**
- **README.md** - kompletna dokumentacja projektu
- **DEVELOPMENT.md** - szczegółowy plan rozwoju
- **Spójny format** - zgodny z innymi projektami

---

## 🏆 **Status Projektu**

✅ **Live Production E-commerce System** - https://uknutamagia.pl  
✅ **Real Business Operations** - Processing actual book orders  
✅ **Custom Domain & SSL** - Professional business presence  
✅ **Utils & Hooks Foundation** - Modern React architecture ready  
🔄 **Component Refactoring in Progress** - Breaking down large components  
📋 **Scalable Architecture Plan Ready** - 3-week development roadmap  
🚀 **Ready for Next Development Phase** - Improved maintainability