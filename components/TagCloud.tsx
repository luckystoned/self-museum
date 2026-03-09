'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const tags = [
  "Futuristic", "Surreal", "Cyberpunk", "Impressionist", "Neon",
  "Oil Painting", "Abstract", "Ethereal", "Vintage", "Botanical",
  "Celestial", "Portrait", "Landscape", "Geometric", "Minimalist",
  "Dreamy", "Mystical", "Vibrant", "Gothic", "Art Nouveau"
];

interface TagCloudProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const TagCloud: React.FC<TagCloudProps> = ({ onGenerate, isGenerating }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleGenerate = () => {
    if (selectedTags.length > 0) {
      onGenerate(selectedTags.join(", "));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
        {tags.map((tag) => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full border-2 transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-transparent border-gray-300 text-gray-700 hover:border-blue-400'
            }`}
          >
            {tag}
          </motion.button>
        ))}
      </div>

      <motion.button
        disabled={isGenerating || selectedTags.length === 0}
        onClick={handleGenerate}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all ${
          isGenerating || selectedTags.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {isGenerating ? "Creating Masterpiece..." : "Generate AI Art"}
      </motion.button>
    </div>
  );
};

export default TagCloud;
