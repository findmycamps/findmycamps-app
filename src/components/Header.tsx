import React, { useState } from "react";
import { Sun, Moon, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";


interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  stickySearchBar?: React.ReactNode; 
  showStickySearchBar?: boolean;     
}

function Header({ toggleDarkMode, isDarkMode, showStickySearchBar = false,
  stickySearchBar  }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <a href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-green-800">
            <span className="font-bold text-lg text-primary-foreground">F</span>
          </div>
          <span className="font-bold text-lg text-foreground">FindMyCamps</span>
        </a>

        <div className="flex-1 max-w-md mx-6">
          {showStickySearchBar && stickySearchBar && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              {stickySearchBar}
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost">List a Camp</Button>
          <Button>Login</Button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AlignJustify className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}

export default Header;
