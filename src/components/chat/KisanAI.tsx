import { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Bot, User, Volume2, Globe, WifiOff, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { offlineCropData, QUICK_QUESTIONS, OfflineCropGuide } from '@/data/offlineCropData';
import { cn } from '@/lib/utils';

// Types
type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

type Language = {
    code: string;
    name: string;
    voiceCode: string;
};

const LANGUAGES: Language[] = [
    { code: 'en-IN', name: 'English', voiceCode: 'en-IN' },
    { code: 'hi-IN', name: 'हिंदी', voiceCode: 'hi-IN' },
    { code: 'mr-IN', name: 'मराठी', voiceCode: 'mr-IN' },
    { code: 'te-IN', name: 'తెలుగు', voiceCode: 'te-IN' },
    { code: 'ta-IN', name: 'தமிழ்', voiceCode: 'ta-IN' },
];

export const KisanAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Namaste! I am Kisan AI. Ask me about crops, fertilizers, or pests. (Offline Mode Supported)",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [currentLang, setCurrentLang] = useState<Language>(LANGUAGES[0]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isTyping, setIsTyping] = useState(false);

    const synthesisRef = useRef<SpeechSynthesis | null>(null);
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            synthesisRef.current = window.speechSynthesis;
        }

        // Initialize Speech Recognition
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = currentLang.code;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Network status listeners
        window.addEventListener('online', () => setIsOffline(false));
        window.addEventListener('offline', () => setIsOffline(true));

        return () => {
            window.removeEventListener('online', () => setIsOffline(false));
            window.removeEventListener('offline', () => setIsOffline(true));
        };
    }, [currentLang]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const speak = (text: string) => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel(); // Stop previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLang.voiceCode;

            // Try to find a matching voice
            const voices = synthesisRef.current.getVoices();
            const matchingVoice = voices.find(v => v.lang.includes(currentLang.voiceCode));
            if (matchingVoice) utterance.voice = matchingVoice;

            synthesisRef.current.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const findOfflineAnswer = (query: string): string => {
        const q = query.toLowerCase();

        // Check for crop keywords
        const cropKey = Object.keys(offlineCropData).find(key => q.includes(key) || offlineCropData[key].name.toLowerCase().includes(q));

        if (cropKey) {
            const data = offlineCropData[cropKey];
            if (q.includes('fertilizer') || q.includes('khad')) {
                return `For ${data.name}: Basal dose - ${data.fertilizer.basal}. Top dressing - ${data.fertilizer.topDressing}`;
            }
            if (q.includes('pest') || q.includes('disease') || q.includes('insect') || q.includes('rog')) {
                return `Common pest in ${data.name} is ${data.pests[0].symptom}. Solution: ${data.pests[0].solution} (Organic: ${data.pests[0].organic})`;
            }
            if (q.includes('harvest') || q.includes('cutting')) {
                return `Harvest ${data.name}: ${data.harvesting}`;
            }
            return `${data.name} (${data.season}): Needs ${data.fertilizer.basal}. Watch out for ${data.pests[0].symptom}.`;
        }

        return "I couldn't find specific info in my offline database. Please try asking about Wheat, Rice, Tomato, Maize, or Cotton.";
    };

    const fetchAIResponse = async (query: string): Promise<string | null> => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Updated to Gemini Key
        if (!apiKey) return null;

        try {
            // Using Google Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Kisan AI, an expert agricultural advisor for Indian farmers. 
                            Provide precise scientific advice on fertilizer management (dosages in kg/acre), crop cycles (Rabi/Kharif), and pest control (chemical and organic).
                            Keep answers short, practical, and easy to understand.
                            Reply in the same language as the user's question or the selected language (${currentLang.name}).
                            
                            User Query: ${query}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0]?.content?.parts[0]) {
                return data.candidates[0].content.parts[0].text;
            }
            return null;
        } catch (e) {
            console.error("AI Fetch Error:", e);
            return null;
        }
    };

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        let responseText = "";

        try {
            // 1. Try Live AI if Online
            if (!isOffline) {
                const aiResponse = await fetchAIResponse(text);
                if (aiResponse) {
                    responseText = aiResponse;
                }
            }

            // 2. Fallback to Offline Logic if AI failed or Offline
            if (!responseText) {
                responseText = findOfflineAnswer(text);
                if (!isOffline) responseText += " (Switched to Offline Knowledge Base)";
            }
        } catch (err) {
            responseText = findOfflineAnswer(text);
        }

        setIsTyping(false);

        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        speak(responseText);
    };

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-[#1b325f] hover:bg-orange-600 transition-all duration-300 z-50 flex items-center justify-center animate-bounce-slow"
                onClick={() => setIsOpen(true)}
            >
                <Bot className="h-8 w-8 text-white" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] shadow-2xl z-50 flex flex-col border-2 border-[#1b325f] animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <CardHeader className="bg-[#1b325f] text-white p-4 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bot className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#1b325f]"></span>
                    </div>
                    <div>
                        <CardTitle className="text-lg leading-none">Kisan AI</CardTitle>
                        <span className="text-[10px] opacity-80 font-medium tracking-wide flex items-center gap-1">
                            {isOffline ? (
                                <><WifiOff className="h-3 w-3" /> OFFLINE MODE</>
                            ) : import.meta.env.VITE_GEMINI_API_KEY ? (
                                <span className="text-green-400 font-bold animate-pulse">GEMINI AI • ONLINE</span>
                            ) : (
                                'LOCAL MODE'
                            )}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                        <Minimize2 className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>

            {/* Language Bar */}
            <div className="bg-gray-100 p-2 flex gap-2 overflow-x-auto border-b">
                {LANGUAGES.map(lang => (
                    <Badge
                        key={lang.code}
                        variant={currentLang.code === lang.code ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer whitespace-nowrap px-3 py-1",
                            currentLang.code === lang.code ? "bg-orange-600 hover:bg-orange-700" : "bg-white hover:bg-gray-200"
                        )}
                        onClick={() => setCurrentLang(lang)}
                    >
                        {lang.name}
                    </Badge>
                ))}
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-start gap-2 max-w-[85%]",
                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                msg.sender === 'user' ? "bg-gray-200" : "bg-blue-100"
                            )}>
                                {msg.sender === 'user' ? <User className="h-5 w-5 text-gray-600" /> : <Bot className="h-5 w-5 text-blue-600" />}
                            </div>
                            <div
                                className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    msg.sender === 'user'
                                        ? "bg-[#1b325f] text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                )}
                            >
                                {msg.text}
                                <div className={cn(
                                    "text-[10px] mt-1 opacity-70",
                                    msg.sender === 'user' ? "text-blue-200" : "text-gray-400"
                                )}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Quick Questions (Chips) */}
            <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-2 no-scrollbar">
                {(QUICK_QUESTIONS[currentLang.code.split('-')[0] as keyof typeof QUICK_QUESTIONS] || QUICK_QUESTIONS['en']).map((q, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t relative">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2"
                >
                    <div className="relative flex-1">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask in your language..."}
                            className={cn(
                                "pr-10 border-gray-300 focus-visible:ring-[#1b325f]",
                                isListening && "border-orange-500 ring-1 ring-orange-500"
                            )}
                        />
                        {isListening && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse delay-150"></span>
                            </span>
                        )}
                    </div>

                    <Button
                        type="button"
                        size="icon"
                        variant={isListening ? "destructive" : "secondary"}
                        className={cn(
                            "rounded-full h-10 w-10 shrink-0",
                            isListening ? "animate-pulse" : "hover:bg-gray-200"
                        )}
                        onClick={toggleListening}
                    >
                        <Mic className="h-5 w-5" />
                    </Button>

                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full h-10 w-10 shrink-0 bg-[#1b325f] hover:bg-orange-600"
                        disabled={!input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </Card>
    );
};
