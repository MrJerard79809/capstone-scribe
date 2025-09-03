import CapstoneGenerator from '@/components/CapstoneGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="flex-1">
        <CapstoneGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
