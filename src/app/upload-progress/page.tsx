'use client';

import React, { useState, useEffect } from 'react';
import ProgressCard from '@/components/ProgressCard';
import { useRouter } from 'next/navigation';

const UploadProgressPage = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<{name: string, size: number} | null>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Read file info from localStorage on mount
  useEffect(() => {
    const storedFileInfo = localStorage.getItem('uploadFileInfo');
    if (storedFileInfo) {
      try {
        const parsed = JSON.parse(storedFileInfo);
        setFileInfo(parsed);
      } catch (e) {
        console.error('Failed to parse file info', e);
      }
    }
  }, []);

  // Poll for progress updates from localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const storedProgress = localStorage.getItem('uploadProgress');
      if (storedProgress) {
        const progressValue = parseInt(storedProgress, 10);
        if (!isNaN(progressValue)) {
          setProgress(progressValue);
        }
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, []);

  // Redirect to home when upload is complete (100%)
  useEffect(() => {
    if (progress >= 100) {
      // Give some time to show completion before redirecting
      const timer = setTimeout(() => {
        // Clear localStorage
        localStorage.removeItem('uploadFileInfo');
        localStorage.removeItem('uploadProgress');
        // Redirect to home
        router.push('/');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">Upload in Progress</h1>
          <p className="text-gray-400">Your file is being securely uploaded</p>
        </div>
        
        <ProgressCard 
          progress={progress} 
          fileName={fileInfo?.name || "Uploading file..."} 
          fileSize={fileInfo ? formatFileSize(fileInfo.size) : "0 bytes"} 
        />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Please do not close this page until the upload is complete</p>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressPage;