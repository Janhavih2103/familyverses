import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Feather } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Feather className="w-5 h-5 text-accent" />
          <span className="font-display text-lg font-semibold text-foreground">Family Verses</span>
        </Link>
        <div className="flex items-center gap-1">
          {!isHome && (
            <Link
              to="/"
              className="px-3 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
          )}
          <Link
            to="/manage"
            className="px-3 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors"
          >
            Manage
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
