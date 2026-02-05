import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sparkles, User } from 'lucide-react';

const BookCharacterChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState('krystyna');
    const messagesEndRef = useRef(null);

    const characters = {
        krystyna: {
            name: 'Krystyna',
            title: 'Wróżka Zębuszka',
            description: 'Dumna reprezentantka pokolenia z szacunkiem do starszych',
            avatar: '🦷'
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Wiadomość powitalna przy zmianie postaci
        if (selectedCharacter) {
            const welcomeMessage = getWelcomeMessage(selectedCharacter);
            setMessages([{
                id: Date.now(),
                text: welcomeMessage,
                sender: 'bot',
                character: selectedCharacter,
                timestamp: new Date()
            }]);
        }
    }, [selectedCharacter]);

    const getWelcomeMessage = (character) => {
        switch(character) {
            case 'krystyna':
                return "Cześć! To ja, Krystyna! Wróżka Zębuszka, w sensie. Właśnie skończyłam czekać przy tym... latopie, to znaczy... jak to się nazywa... laptopie! Bajkomistrz Eleonor kazał mi z tobą pogadać. Możesz mnie o wszystko spytać - o zęby, o tą, tę Miłą Mię z YouTuba, o moją kulę... w sensie, że szklana kula, no. Tylko nie pytaj o technologie, bo ja to, to, to... no wiesz, nie bardzo się na tym znam. Hi, hi!";
            default:
                return "Cześć! Jestem gotowy na rozmowę!";
        }
    };

    const generateResponse = async (userMessage, character) => {
        // Symulacja myślenia
        setIsTyping(true);

        // Opóźnienie dla realizmu
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        let response = "";

        switch(character) {
            case 'krystyna':
                response = generateKrystynaResponse(userMessage);
                break;
            default:
                response = "Nie wiem co powiedzieć...";
        }

        setIsTyping(false);
        return response;
    };

    const generateKrystynaResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        // Reakcje na konkretne tematy
        if (message.includes('zęby') || message.includes('ząb')) {
            return "Ach, zęby! To moja specjalność, w sensie. Każdego dnia to coraz więcej tych mleczaków dzieciątkom wypada. Sypią się niczym pierze ze starej poduszki! A ja to, to, to... wszystkie je zbieramy z dumą. Mam wzrok sokołowy, więc żadnego ząbka mi nie umknie. W sensie, że zawodowe zboczenienie mam - wszędzie widzę tylko zęby, no!";
        }

        if (message.includes('laptop') || message.includes('latop') || message.includes('komputer')) {
            return "Oj, ten latop... to znaczy laptop! To dla mnie czarne pudło z klawiszami jest. Bajkomistrz Eleonor kazał mi go włączyć i czekać. Buczy jak maszynka do mięsa, w sensie. Myślałam, że może kawkę mi zrobi - taką z pianką, co to biały wąsik pod nosem zostaje. Mniam, mniam... Ale nic z tego nie wyszło, to, to, to...";
        }

        if (message.includes('miła mia') || message.includes('youtube') || message.includes('mia')) {
            return "Miła Mia! Ach, to dziecko ma więcej energii niż cała gromada elfów na wiosennej potańcówce! Widziałam ją przez ten monitoring - rączkami wymachuje, brwiami jak gąsienicami nad oczami porusza. Subsklybowałam jej kanał, w sensie. Ale co ona robiła z tą laleczką Elzą... ojej! Warkocz jej obcięła i Swenowi przyklejła jako brodę. W sensie, że bardzo kreatywna ta Miła Mia jest!";
        }

        if (message.includes('eleonor') || message.includes('bajkomistrz')) {
            return "Bajkomistrz Eleonor to bardzo doświadczony życiowo! Ma siwiutką brodę i niebieski kapelusz z pawim piórem - chociaż czasem go z Świętym Mikołajem mylę, bo też brodę ma. W sensie, że szacunek do starszych mam bezgraniczny i jego doświadczeniu ufam. To on kazał mi z tym latopem się zapoznać, to, to, to...";
        }

        if (message.includes('kula') || message.includes('szklana')) {
            return "Moja ukochana szklana kula! To przez nią komunikuję się z innymi. Trzeba ją poprawnie potrzeć - cztery potarcia lewą dłonią z dołu, trzy prawą z góry... Ale jak się zamyślę, to czasem źle potarę i zamiast z Eleonorem łączę się ze Świętym Mikołajem. W sensie, że pomyłka wychodzi, no!";
        }

        if (message.includes('cześć') || message.includes('hej') || message.includes('dzień dobry')) {
            return "Cześć jak Czesia! W sensie, że bardzo się cieszę, że ze mną rozmawiasz! To, to, to... rzadko ktoś chce z Wróżką Zębuszką pogadać. Zwykle tylko wtedy, jak ząbek boli albo wypada. A tak normalnie, to cisza jak makowcem zasiał w mojej komnacie!";
        }

        if (message.includes('książka') || message.includes('historia')) {
            return "Ach, ta historia... to, to, to całe nieporozumienie było! Bajkomistrz Eleonor chciał mi pokazać Miłą Mię przez ten latop, ale ja myślałam, że ona ma być moją uczennicą. W sensie, że następczynią. A tymczasem... no właśnie! Sam nie wiem co tymczasem. Ale na pewno dużo się działo - i z YouTube, i z nożyczkami, i z Elzą bez warko... w sensie, z włosami...";
        }

        // Ogólne odpowiedzi z charakterystycznym stylem Krystyny
        const generalResponses = [
            "To, to, to... bardzo ciekawe pytanie! W sensie, że... no wiesz... zastanowię się nad tym, jak będę następnym razem kulę swoją szklana potrzeć.",
            "Oj, nie wiem czy dobrze zrozumiałam, w sensie. Możesz powtórzyć? Czasem się mylę, bo myślami jestem przy tych mleczakach, co dzieciom wypadają...",
            "Wiesz co? Zapytałabym bajkomistrza Eleonora, ale on teraz pewnie ma dużo pracy. W sensie, że zawsze ma. Może sama spróbuję odpowiedzieć - chociaż to, to, to nie moja forte...",
            "Hm, hm... Gdybym miała wzrok sokołowy nie tylko do ząbków, ale i do innych spraw, to może bym wiedziała! W sensie, że... no... może spróbuj inaczej zapytać?",
            "Ach! Przypomniałaś mi się! Właśnie wczoraj podobną sytuację miałam, gdy... a nie, to chyba był przedwczoraj... czy może w ogóle w zeszłym tygodniu? W sensie, że czas to dla mnie zagadka większa niż ten latop!"
        ];

        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        const response = await generateResponse(inputValue, selectedCharacter);

        const botMessage = {
            id: Date.now() + 1,
            text: response,
            sender: 'bot',
            character: selectedCharacter,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const currentCharacter = characters[selectedCharacter];

    return (
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
             style={{
                 background: 'rgb(14 15 20)',
                 boxShadow: '0 10px 15px rgb(0 0 0 / 45%)',
                 border: '1px solid rgb(255 255 255 / 10%)'
             }}>
            {/* Header */}
            <div className="p-6"
                 style={{
                     background: 'linear-gradient(90deg, #13192E 0%, #152869 100%)',
                     borderBottom: '1px solid rgb(255 255 255 / 10%)'
                 }}>
                <div className="flex items-center gap-4">
                    <div className="text-4xl">{currentCharacter.avatar}</div>
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2"
                            style={{
                                color: '#E2C275',
                                fontFamily: '"Instrument Serif", serif'
                            }}>
                            <MessageCircle className="w-6 h-6" />
                            Porozmawiaj z {currentCharacter.name}
                        </h2>
                        <p style={{ color: '#fff', opacity: 0.9, fontSize: '1rem' }}>
                            {currentCharacter.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Character Selection */}
            <div className="p-4"
                 style={{
                     background: 'rgb(20 22 28)',
                     borderBottom: '1px solid rgb(255 255 255 / 10%)'
                 }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#E2C275' }}>
                    <Sparkles className="w-4 h-4" />
                    <span>Wybierz postać:</span>
                </div>
                <div className="mt-2 flex gap-2">
                    {Object.entries(characters).map(([key, char]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCharacter(key)}
                            className="px-4 py-2 rounded-lg font-medium transition-all"
                            style={{
                                fontFamily: '"Instrument Serif", serif',
                                fontSize: '1rem',
                                ...(selectedCharacter === key
                                    ? {
                                        color: '#000',
                                        backgroundColor: '#E2C275',
                                        boxShadow: '0 6px 25px rgb(0 0 0 / 40%)'
                                    }
                                    : {
                                        color: '#E2C275',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #E2C275'
                                    })
                            }}
                            onMouseEnter={(e) => {
                                if (selectedCharacter !== key) {
                                    e.target.style.backgroundColor = 'rgb(20 22 28)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedCharacter !== key) {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {char.avatar} {char.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4"
                 style={{ background: 'rgb(14 15 20)' }}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl"
                            style={{
                                fontFamily: '"Instrument Serif", serif',
                                fontSize: '1rem',
                                ...(message.sender === 'user'
                                    ? {
                                        backgroundColor: '#E2C275',
                                        color: '#000',
                                        boxShadow: '0 4px 20px rgb(0 0 0 / 30%)'
                                    }
                                    : {
                                        background: 'linear-gradient(90deg, #13192E 0%, #152869 100%)',
                                        color: '#fff',
                                        border: '1px solid rgb(255 255 255 / 10%)',
                                        boxShadow: '0 4px 20px rgb(0 0 0 / 30%)'
                                    })
                            }}
                        >
                            {message.sender === 'bot' && (
                                <div className="flex items-center gap-2 mb-1" style={{ opacity: 0.9 }}>
                                    <span className="text-lg">{characters[message.character]?.avatar}</span>
                                    <span className="text-sm font-medium" style={{ color: '#E2C275' }}>
                    {characters[message.character]?.name}
                  </span>
                                </div>
                            )}
                            <p className="leading-relaxed">{message.text}</p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div
                            className="px-4 py-3 rounded-2xl max-w-xs"
                            style={{
                                background: 'linear-gradient(90deg, #13192E 0%, #152869 100%)',
                                color: '#fff',
                                border: '1px solid rgb(255 255 255 / 10%)',
                                boxShadow: '0 4px 20px rgb(0 0 0 / 30%)'
                            }}
                        >
                            <div className="flex items-center gap-2 mb-1" style={{ opacity: 0.9 }}>
                                <span className="text-lg">{currentCharacter.avatar}</span>
                                <span className="text-sm font-medium" style={{ color: '#E2C275' }}>
                  {currentCharacter.name}
                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#E2C275' }}></div>
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#E2C275', animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#E2C275', animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6"
                 style={{
                     background: 'rgb(20 22 28)',
                     borderTop: '1px solid rgb(255 255 255 / 10%)'
                 }}>
                <div className="flex gap-3">
                    <div className="flex-1 relative">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Napisz wiadomość do ${currentCharacter.name}...`}
                className="w-full px-4 py-3 pr-12 rounded-xl resize-none focus:outline-none"
                style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: '1rem',
                    backgroundColor: 'rgb(14 15 20)',
                    color: '#fff',
                    border: '1px solid rgb(255 255 255 / 10%)',
                    boxShadow: '0 4px 20px rgb(0 0 0 / 30%)'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#E2C275';
                    e.target.style.boxShadow = '0 0 0 3px rgb(226 194 117 / 20%)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'rgb(255 255 255 / 10%)';
                    e.target.style.boxShadow = '0 4px 20px rgb(0 0 0 / 30%)';
                }}
                rows="2"
            />
                        <User className="absolute right-3 top-3 w-5 h-5" style={{ color: '#E2C275' }} />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="px-6 py-3 rounded-xl font-medium transition-all"
                        style={{
                            fontFamily: '"Instrument Serif", serif',
                            fontSize: '1rem',
                            ...((!inputValue.trim() || isTyping)
                                ? {
                                    backgroundColor: 'rgb(20 22 28)',
                                    color: 'rgb(255 255 255 / 30%)',
                                    cursor: 'not-allowed',
                                    border: '1px solid rgb(255 255 255 / 10%)'
                                }
                                : {
                                    backgroundColor: '#E2C275',
                                    color: '#000',
                                    border: '1px solid transparent',
                                    boxShadow: '0 4px 20px rgb(0 0 0 / 30%)'
                                })
                        }}
                        onMouseEnter={(e) => {
                            if (inputValue.trim() && !isTyping) {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#E2C275';
                                e.target.style.borderColor = '#E2C275';
                                e.target.style.boxShadow = '0 6px 25px rgb(0 0 0 / 40%)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (inputValue.trim() && !isTyping) {
                                e.target.style.backgroundColor = '#E2C275';
                                e.target.style.color = '#000';
                                e.target.style.borderColor = 'transparent';
                                e.target.style.boxShadow = '0 4px 20px rgb(0 0 0 / 30%)';
                            }
                        }}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: 'rgb(255 255 255 / 50%)' }}>
                    Naciśnij Enter aby wysłać wiadomość • Postać odpowiada w swoim charakterystycznym stylu
                </p>
            </div>
        </div>
    );
};

export default BookCharacterChat;