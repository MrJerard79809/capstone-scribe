import { BookOpen, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Capstone Generator</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>for academic excellence</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            © 2024 Professional Academic Tools
          </div>
        </div>
      </div>
    </footer>
  );
}