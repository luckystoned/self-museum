"use client";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { motion, AnimatePresence } from "framer-motion";

const artConcepts = [
    { id: "style", title: "Estilo", options: ["Cyberpunk", "Surrealismo", "Acuarela", "Óleo Intenso", "Pixel Art"] },
    { id: "mood", title: "Emoción", options: ["Melancolía", "Euforia", "Misterio", "Serenidad", "Caos"] },
    { id: "element", title: "Sujeto", options: ["Ciudadela", "Retrato", "Naturaleza", "Espacio Profundo", "Geometría"] },
    { id: "palette", title: "Paleta", options: ["Neón", "Monocromo", "Pastel", "Tierras", "Vibrante"] },
];

interface ArtOracleProps {
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
}

export function ArtOracle({ onGenerate, isGenerating }: ArtOracleProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(0);

    const handleSelect = (categoryId: string, option: string) => {
        setSelections((prev) => ({ ...prev, [categoryId]: option }));
        if (currentStep < artConcepts.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 600);
        }
    };

    const handleGenerate = () => {
        const prompt = Object.values(selections).join(", ");
        onGenerate(prompt);
    };

    const isComplete = Object.keys(selections).length === artConcepts.length;
    const currentCategory = artConcepts[currentStep];

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] py-10 relative">
            <div className="text-center mb-8 h-24">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    El Oráculo de Arte
                </h2>
                <p className="text-neutral-400 mt-2">
                    {isComplete
                        ? "Tu destino visual está escrito."
                        : `Selecciona tu ${currentCategory.title.toLowerCase()}...`}
                </p>
            </div>

            {!isComplete ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap justify-center gap-6 max-w-5xl"
                    >
                        {currentCategory.options.map((option, idx) => (
                            <CardContainer key={option} className="m-2">
                                <div onClick={() => handleSelect(currentCategory.id, option)}>
                                    <CardBody className="bg-black/40 backdrop-blur-md relative group/card border-white/[0.1] border w-auto sm:w-[15rem] h-auto rounded-xl p-6 hover:shadow-2xl hover:shadow-emerald-500/[0.1] cursor-pointer transition-all">
                                        <CardItem
                                            translateZ="50"
                                            className="text-xl font-bold text-white text-center w-full mt-4 flex items-center justify-center h-24"
                                        >
                                            {option}
                                        </CardItem>
                                        <CardItem
                                            as="p"
                                            translateZ="60"
                                            className="text-neutral-400 text-sm w-full text-center mt-2 group-hover/card:text-emerald-300"
                                        >
                                            Seleccionar
                                        </CardItem>
                                    </CardBody>
                                </div>
                            </CardContainer>
                        ))}
                    </motion.div>
                </AnimatePresence>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="flex flex-wrap gap-4 justify-center max-w-2xl bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                        {Object.entries(selections).map(([key, value]) => (
                            <span key={key} className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm font-medium">
                                {value}
                            </span>
                        ))}
                    </div>

                    <button
                        disabled={isGenerating}
                        onClick={handleGenerate}
                        className={`px-12 py-4 rounded-xl font-bold text-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all ${isGenerating
                                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                : "bg-white text-black hover:scale-105 hover:bg-neutral-200"
                            }`}
                    >
                        {isGenerating ? "Manifestando Visión..." : "Revelar Obra"}
                    </button>

                    <button
                        onClick={() => { setSelections({}); setCurrentStep(0); }}
                        className="text-neutral-400 text-sm hover:text-white underline decoration-neutral-500 underline-offset-4"
                    >
                        Reiniciar viaje
                    </button>
                </motion.div>
            )}
        </div>
    );
}
