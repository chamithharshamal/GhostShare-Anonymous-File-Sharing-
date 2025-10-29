import React, { useState } from 'react';
import { CheckIcon, ClipboardIcon, RefreshCwIcon, Share2Icon } from './Icons';

interface LinkCardProps {
  link: string;
  onReset: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-lg">
      <div className="mx-auto bg-teal-500/10 border-2 border-teal-500 rounded-full w-16 h-16 flex items-center justify-center">
        <Share2Icon className="w-8 h-8 text-teal-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mt-4 text-center">Your link is ready!</h2>
      <p className="text-gray-400 mt-1 text-center">Anyone with this link can download the file. It will expire based on your selection.</p>
      
      <div className="mt-6 bg-gray-900 p-4 border border-gray-700 rounded-lg">
        <div className="text-gray-400 text-sm mb-2 text-center">Download Link</div>
        <div className="font-mono text-gray-300 break-all text-sm p-2 bg-gray-800 rounded mb-3 min-h-[40px] flex items-center">
          {link}
        </div>
        <button
          onClick={handleCopy}
          className={`w-full px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2 ${copied ? 'bg-green-600' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};

export default LinkCard;