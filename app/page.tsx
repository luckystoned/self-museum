'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtOracle } from '@/components/ui/ArtOracle';
import axios from 'axios';

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'printing'>('idle');
  const [promptId, setPromptId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setError(null);
    setStatus('generating');
    try {
      const response = await axios.post('/api/generate', { prompt });
      if (response.data.success) {
        setPromptId(response.data.prompt_id);
      } else {
        throw new Error(response.data.error || 'Failed to generate');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setStatus('idle');
    }
  };

  const handlePrint = async () => {
    if (!filename) return;
    setStatus('printing');
    try {
      const response = await axios.post('/api/print', { filename });
      if (response.data.success) {
        // Success!
        setTimeout(() => setStatus('ready'), 3000);
      } else {
        throw new Error(response.data.error || 'Failed to print');
      }
    } catch (err: any) {
      console.error(err);
      // Axios wraps server errors — extract the real message from the response body if available
      const serverMessage = err.response?.data?.error;
      setError(serverMessage || err.message);
      setStatus('ready');
    }
  };

  // Polling for image completion
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'generating' && promptId) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/status/${promptId}`);
          if (response.data.status === 'completed') {
            const fname = response.data.filename;
            setFilename(fname);
            setImageUrl(`/api/image/${fname}`);
            setStatus('ready');
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, promptId]);

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <header className="py-12 text-center bg-neutral-950 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_100%)] pointer-events-none" />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        >
          Self-Museum Oracle
        </motion.h1>
        <p className="text-neutral-400 text-lg">Descubre y materializa tu galería interior.</p>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4 flex flex-col items-center">
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-8 w-full max-w-2xl backdrop-blur-sm">
            <p className="font-semibold">Error Criptográfico</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        )}

        <div className="w-full">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <ArtOracle onGenerate={handleGenerate} isGenerating={false} />
              </motion.div>
            )}

            {status === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-8 py-32"
              >
                <div className="relative">
                  <div className="w-32 h-32 border-[3px] border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-emerald-500/50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full animate-pulse blur-md"></div>
                  </div>
                </div>
                <p className="text-2xl font-medium text-emerald-400 animate-pulse tracking-widest uppercase text-sm">Decodificando el plano astral...</p>
              </motion.div>
            )}

            {status === 'ready' && imageUrl && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-12 py-10"
              >
                <div className="relative group p-2 rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img
                    src={imageUrl}
                    alt="Arte Generado"
                    className="max-w-full h-auto w-[512px] aspect-square object-cover rounded-xl shadow-2xl ring-1 ring-white/10"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] hover:bg-emerald-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.8)] transition-all flex items-center gap-2"
                  >
                    <span>Imprimir Obra Única</span>
                  </motion.button>
                  <button
                    onClick={() => setStatus('idle')}
                    className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    Nueva Generación
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'printing' && (
              <motion.div
                key="printing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-8 py-32 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] filter grayscale opacity-80"
                >
                  🖨️
                </motion.div>
                <p className="text-2xl font-medium tracking-wide text-emerald-400">Materializando en la realidad...</p>
                <p className="text-neutral-500">Un momento. El lienzo físico se está preparando.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-8 text-center text-neutral-600 text-sm border-t border-white/5 bg-neutral-950">
        <p>© {new Date().getFullYear()} Self Museum - Oráculo Físico-Digital</p>
      </footer>
    </div>
  );
}
