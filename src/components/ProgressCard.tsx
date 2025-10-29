import React from 'react';
import { FileIcon } from './Icons';

interface ProgressCardProps {
  progress: number;
  fileName: string;
  fileSize: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress, fileName, fileSize }) => {
  const messages = [
    { threshold: 0, text: 'Initiating secure connection...' },
    { threshold: 25, text: 'Encrypting and uploading file...' },
    { threshold: 75, text: 'Finalizing transfer...' },
    { threshold: 99, text: 'Generating your secure link...' },
  ];

  const currentMessage = messages.slice().reverse().find(m => progress >= m.threshold)?.text || 'Starting...';

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-lg">
      <div className="space-y-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
          <FileIcon className="w-6 h-6 text-teal-400 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-white font-medium truncate" title={fileName}>{fileName}</p>
            <p className="text-sm text-gray-400">{fileSize}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-white">{currentMessage}</span>
            <span className="text-sm font-medium text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-teal-500 h-2.5 rounded-full transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;