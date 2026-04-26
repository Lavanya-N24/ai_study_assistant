"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Upload, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems: { name: string; href: string; icon: any }[] = [];

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-themePurple-50 rounded-xl group-hover:bg-themePurple-100 transition-colors">
              <BookOpen className="w-6 h-6 text-themePurple-600" />
            </div>
            <span className="font-bold text-xl tracking-tight text-themePurple-700 hidden sm:block">
              AiStudy<span className="text-slate-800">.io</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-4">
             {/* Removed nav items per user request */}
          </nav>
        </div>
      </div>
    </header>
  );
}
