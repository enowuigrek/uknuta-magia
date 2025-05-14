import './App.css'
import {author} from "./content/book.js";
import {CursorGlow} from './components/CursorGlow/CursorGlow.jsx'
import {Header} from './components/Header/Header.jsx'
import {SectionHeader} from "./components/SectionHeader/SectionHeader.jsx";
import {Footer} from "./components/Footer/Footer.jsx";
import {ContentSection} from "./components/ContentSection/ContentSection.jsx";

function App() {
  return (
    <>
        <CursorGlow/>
        <Header/>
        <ContentSection/>
        {/*do poprawy zeby byl content, HeaderSection i do uzywania w innych komponentach*/}
        <SectionHeader header={author.title} text={author.description}/>
        <Footer/>
    </>
  )
}

export default App
