import CapstoneGenerator from '@/components/CapstoneGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <CapstoneGenerator />
    </div>
  );
};

export default Index;
