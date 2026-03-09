'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TagCloud from '@/components/TagCloud';
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
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="py-12 text-center bg-gray-50 border-b border-gray-100">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
        >
          AI Art Station
        </motion.h1>
        <p className="text-gray-500 text-lg">Pick your tags and create a local masterpiece.</p>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-8 w-full">
            <p className="font-semibold">Error</p>
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
              >
                <TagCloud onGenerate={handleGenerate} isGenerating={false} />
              </motion.div>
            )}

            {status === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-8 py-20"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-2xl font-medium text-gray-600 animate-pulse">Painting your masterpiece...</p>
              </motion.div>
            )}

            {status === 'ready' && imageUrl && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="relative group overflow-hidden rounded-2xl shadow-2xl bg-white border border-gray-100">
                  <img
                    src={imageUrl}
                    alt="AI Art"
                    className="max-w-full h-auto w-[512px] aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-green-700 transition-colors"
                  >
                    Send to Printer
                  </motion.button>
                  <button
                    onClick={() => setStatus('idle')}
                    className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-xl hover:bg-gray-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'printing' && (
              <motion.div
                key="printing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-8 py-20 text-center"
              >
                <div className="text-6xl mb-4">🖨️</div>
                <p className="text-2xl font-medium text-green-600">Your artwork is being printed!</p>
                <p className="text-gray-500">Please wait a moment while the printer handles it.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-12 text-center text-gray-400 text-sm border-t border-gray-50">
        <p>© 2026 Self Museum - AI Art Station</p>
      </footer>
    </div>
  );
}
