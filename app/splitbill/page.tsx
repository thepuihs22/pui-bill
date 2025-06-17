"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initLiff, isLoggedIn } from '@/app/service/liff.service';
import Image from 'next/image';

export default function KraiJaiIndex() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkLiff = useCallback(async () => {
    try {
      await initLiff();
      if (isLoggedIn()) {
        setLoggedIn(true);
        router.replace('/splitbill/app');
      } else {
        setLoggedIn(false);
      }
    } catch (err) {
      // Optionally handle error
      setLoggedIn(false);
      console.error('LIFF init error:', err);
    } finally {
      setChecking(false);
    }
  }, [router]);

  useEffect(() => {
    checkLiff();
  }, [checkLiff]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFFE9] text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <span className="text-xl font-mono">Loading...</span>
      </div>
    );
  }

  // If not logged in, show landing page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFFE9] text-gray-800 dark:bg-gray-900 dark:text-gray-100 px-4">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight drop-shadow-lg">KraiJai</h1>
        <p className="mb-8 text-lg md:text-xl text-center max-w-xl font-mono">
          Join KraiJai on LINE to get started!<br />Scan the QR code below to follow our official account.
        </p>
        <a
          href="https://lin.ee/QNsgC3J"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border-4 border-[#829aff] shadow-[4px_4px_0px_0px_#829aff] hover:shadow-[6px_6px_0px_0px_#829aff] transition-all bg-white/90 p-4 mb-6"
        >
        
          <Image
            src="https://qr-official.line.me/gs/M_159qswzq_GW.png?oat_content=qr"
            alt="KraiJai LINE QR Code"
            width={240}
            height={240}
            className="w-60 h-60 object-contain"
            priority
          />
        </a>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-2 text-center">
          Or tap the QR code to open our LINE account directly.
        </p>
      </div>
      <footer className="w-full text-center text-sm text-gray-500 dark:text-gray-400 border-t-2 border-black dark:border-white pt-4 pb-6 mt-8">
        <p>© {new Date().getFullYear()} KraiJai by Futureboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
