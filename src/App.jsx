import './App.css'
import {Header} from './components/Header/Header.jsx'
import {SectionHeader} from "./components/SectionHeader/SectionHeader.jsx";
import {bookDescription, author} from "./content/book.js";

function App() {
  return (
    <>
        <Header/>
        <SectionHeader header={bookDescription.title} text={bookDescription.description}/>
        <SectionHeader header={author.title} text={author.description}/>

    </>
  )
}

export default App
