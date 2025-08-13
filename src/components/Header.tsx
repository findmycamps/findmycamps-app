"use client"; // This component now uses client-side hooks

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Sun, Moon, AlignJustify, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  stickySearchBar?: React.ReactNode;
  showStickySearchBar?: boolean;
}

function Header({
  toggleDarkMode,
  isDarkMode,
  showStickySearchBar = false,
  stickySearchBar,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth(); // Get user from our context
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ACDB95]/50 bg-[#FFFBEB]/80 backdrop-blur supports-[backdrop-filter]:bg-[#FFFBEB]/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between text-[#00524C]">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#00524C] to-[#ACDB95]">
            <span className="font-bold text-lg text-[#FFFBEB]">F</span>
          </div>
          <span className="font-bold text-lg">FindMyCamps</span>
        </Link>

        <div className="flex-1 max-w-md mx-6">
          {showStickySearchBar && stickySearchBar && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              {stickySearchBar}
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" className="hover:bg-[#ACDB95]/30" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" className="hover:bg-[#ACDB95]/30 font-semibold">List a Camp</Button>
          
          {user ? (
            // If user is logged in, show their email and a logout button
            <>
              <span className="text-sm text-[#00524C]/80 hidden lg:inline">{user.email}</span>
              <Button variant="ghost" className="hover:bg-[#ACDB95]/30 font-semibold" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            // If user is not logged in, show the Login button
            <Link href="/auth" passHref>
                <Button className="bg-[#00524C] text-[#FFFBEB] hover:bg-[#00524C]/90 font-semibold">Login</Button>
            </Link>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AlignJustify className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
         <div className="md:hidden px-4 pt-2 pb-4 border-t border-[#ACDB95]/50 bg-[#FFFBEB]">
          <nav className="flex flex-col space-y-2 text-[#00524C]">
            <Button variant="ghost" className="hover:bg-[#ACDB95]/30 font-semibold w-full justify-start">List a Camp</Button>
            {user ? (
              <Button variant="ghost" className="hover:bg-[#ACDB95]/30 font-semibold w-full justify-start" onClick={handleLogout}>Logout</Button>
            ) : (
              <Link href="/auth" passHref>
                <Button className="bg-[#00524C] text-[#FFFBEB] hover:bg-[#00524C]/90 font-semibold w-full">Login</Button>
              </Link>
            )}
            <Button variant="ghost" className="hover:bg-[#ACDB95]/30 font-semibold w-full justify-start" onClick={toggleDarkMode}>
              Toggle Theme
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
