import { Feather } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <Feather className="w-5 h-5 text-accent mx-auto mb-3" />
        <p className="font-display text-sm text-muted-foreground">
          Family Verses — A shared space for words, memories, and emotions.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
