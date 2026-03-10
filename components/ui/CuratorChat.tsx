"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export function CuratorChat() {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading } =
        useChat({
            api: "/api/chat",
            initialMessages: [
                {
                    id: "1",
                    role: "assistant",
                    content: "Bienvenido al Museum of Self. Soy El Curador. ¿Qué emociones o colores te gustaría explorar en tu próxima obra?",
                },
            ],
        });

    // Auto-scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {/* Botón flotante para abrir el curador */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                    } bg-neutral-900 border border-emerald-500/30 text-emerald-400 hover:shadow-[0_0_20px_1px_rgba(16,185,129,0.3)]`}
            >
                <Sparkles size={28} />
            </motion.button>

            {/* Ventana de Chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <MessageCircle size={20} />
                                <span className="font-semibold tracking-wide">El Curador</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Area de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
                            {messages.map((m) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={m.id}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${m.role === "user"
                                                ? "bg-emerald-600 text-white rounded-br-none"
                                                : "bg-neutral-800 text-neutral-200 rounded-bl-none border border-white/5"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{m.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-neutral-800 text-neutral-400 rounded-2xl rounded-bl-none px-4 py-2 border border-white/5">
                                        <span className="animate-pulse">Escribiendo profecía...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Formulario */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-3 bg-black/50 border-t border-white/10 flex items-center gap-2"
                        >
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Revela tus pensamientos..."
                                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white rounded-xl transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
