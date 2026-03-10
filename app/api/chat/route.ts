import { streamText } from 'ai';
import { createOllama } from 'ai-sdk-ollama';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// The user specifies the Ollama URL here or defaults to local
const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434/api';

const ollama = createOllama({
    baseURL: ollamaUrl,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: ollama('llama3.2'), // Replace with whatever model user has (ej: llama3.2, mistral)
            system: `Eres "El Curador", una inteligencia artificial sofisticada y elegante que guía a las personas en el "Self-Museum". 
      Tu objetivo es ser un oráculo poético de arte. Hazle una o dos preguntas introspectivas cortas al usuario sobre cómo se siente hoy o qué quiere ver (colores, emociones, conceptos). 
      Cuando tengas suficiente información, sugiere de forma muy breve un "prompt para arte digital", por ejemplo: "Te sugiero un paisaje surrealista en tonos neón".
      Sé misterioso, amable y muy directo (respuestas de máximo 2 o 3 líneas).`,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error("Error connected to Ollama:", error);
        return new Response(JSON.stringify({
            error: "No se pudo contactar al Oráculo. ¿Está Ollama corriendo y la URL es correcta?"
        }), { status: 500 });
    }
}
