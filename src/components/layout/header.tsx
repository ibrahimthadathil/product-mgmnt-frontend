import { ShoppingBag, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">E-Commerce</span>
        </div>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-100 p-1">
          <Button variant="secondary" size="sm" className="bg-white shadow-sm border-none rounded-full px-6">Home</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-6 text-slate-600">Products</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-6 text-slate-600">Cart</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-6 text-slate-600">Login</Button>
        </nav>

        <div className="flex items-center gap-4">
            <Button variant="secondary" size="icon" className="h-9 w-9 bg-slate-100 border-none">
                <Sun className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </header>
  );
};