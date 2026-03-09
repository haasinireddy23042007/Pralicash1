import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Btn } from './ui';
import { MessageSquare, Send, Bot, User, Loader2, Mic, Volume2 } from 'lucide-react';
import readmeContent from '../../README.md?raw';

export default function AiAssistant({ dashboardData, speak }) {
    const [language, setLanguage] = useState("en");
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your PraliCash AI Guide. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef(null);

    // When language changes, add a system message to acknowledge the switch
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        const introMap = {
            en: "Language set to English.",
            hi: "भाषा हिंदी में सेट कर दी गई है। पूछें कि मैं आपकी क्या मदद कर सकता हूँ!",
            te: "భాష తెలుగుకి మార్చబడింది. నేను మీకు ఎలా సహాయపడగలను అని అడగండి!"
        };
        setMessages(prev => [...prev, { role: 'assistant', content: introMap[newLang] }]);
        // Remove auto-play on language switch
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input.");
            return;
        }

        const recognition = new SpeechRecognition();

        // Map UI languages to Browser Web Speech API codes
        const langCodeMap = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' };
        recognition.lang = langCodeMap[language] || 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (e) => {
            console.error("Speech Recognition Error:", e);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Immediately send the transcribed voice text
            handleSend(transcript);
        };

        recognition.start();
    };

    const handleSend = async (overrideInput = null) => {
        const textToSend = typeof overrideInput === 'string' ? overrideInput : input;
        if (!textToSend.trim()) return;

        const userMsg = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Build the dynamic dashboard context string
        const contextStr = dashboardData
            ? `Current user is ${dashboardData.name || 'a Farmer'}. They currently have ${dashboardData.listingsCount} active listings, ${dashboardData.totalTonnes} tonnes of total stubble available, and have earned ₹${dashboardData.earnings} from accepted matches.`
            : `No specific user data available.`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer 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`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "arcee-ai/trinity-large-preview:free",
                    stream: true,
                    messages: [
                        {
                            role: "system",
                            content: `You are the PraliCash AI Assistant. 
Use the following context from our README to answer user questions:
---
${readmeContent}
---
DYNAMIC CONTEXT FOR THIS SPECIFIC USER:
${contextStr}

CRITICAL INSTRUCTION: You MUST reply exclusively in the following language code: ${language.toUpperCase()}. Do not use any other language in your response.`
                        },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        userMsg
                    ]
                })
            });

            if (!response.ok) throw new Error("Network response was not ok");

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullAiText = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === 'data: [DONE]') continue;
                    if (trimmed.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(trimmed.slice(6));
                            if (data.choices?.[0]?.delta?.content) {
                                fullAiText += data.choices[0].delta.content;
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: fullAiText };
                                    return newMsgs;
                                });
                            }
                        } catch (e) {
                            // ignore incomplete json chunk errors
                        }
                    }
                }
            }

            // Removed auto-play at the end of the stream

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] w-full border border-gray-100 dark:border-zinc-800 shadow-xl shadow-blue-100/50 dark:shadow-none bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-zinc-100">Farmer Support</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">PraliCash AI Voice</p>
                    </div>
                </div>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg px-2 py-1 text-gray-700 dark:text-zinc-300 outline-none focus:border-blue-500"
                >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                </select>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm relative group ${msg.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-sm'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-sm mr-8'
                            }`}>
                            {msg.content}
                            {msg.role === 'assistant' && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (speak) speak(msg.content.replace(/[*#_`]/g, ''), language);
                                    }}
                                    className="absolute -right-10 bottom-1 p-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-blue-100 dark:hover:bg-blue-900/40 z-10 cursor-pointer"
                                    title="Read Aloud"
                                >
                                    <Volume2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
                            <Loader2 size={16} className="text-gray-500 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
                <Input
                    className="flex-1 m-0"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Btn onClick={startListening} color={isListening ? "red" : "ghost"} className="px-3" title="Speak to AI">
                    <Mic size={18} className={isListening ? "animate-pulse" : ""} />
                </Btn>
                <Btn onClick={handleSend} color="blue" disabled={isLoading || !input.trim()} className="px-3">
                    <Send size={18} />
                </Btn>
            </div>
        </Card>
    );
}
