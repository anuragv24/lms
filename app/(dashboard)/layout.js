"use client";

import Sidebar from "@/components/Sidebard";
import { Menu, Library, X } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mockUser = { role: "admin" };

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-zinc-100 overflow-hidden relative">

      <Sidebar currentUser={mockUser} />

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-64 h-full relative z-50 animate-in slide-in-from-left duration-200">
            {/* Close button anchor inside mobile menu sheet */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-4 p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 rounded-lg border border-zinc-800"
            >
              <X size={16} />
            </button>
            <Sidebar currentUser={mockUser} isMobile={true} />
          </div>
          {/* Backdrop clicking listener automatically collapses the sheet drawer */}
          <div
            className="absolute inset-0 w-full h-full"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden w-full bg-zinc-950 border-b border-zinc-800 p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white">
              <Library size={16} className="stroke-[2.5]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-100">
              AV Labs Library
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors border border-zinc-800"
          >
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto focus:outline-none">
          <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
