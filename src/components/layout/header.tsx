"use client";

import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navItems } from '@/const/navItems';


export const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/shop') {
      return pathname === '/shop' || pathname?.startsWith('/shop/');
    }
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">E-Commerce</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-100 p-1 relative">
          <AnimatePresence>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ scale: active ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "rounded-full px-6 relative z-10 transition-colors",
                        active
                          ? "text-slate-900"
                          : "text-slate-600"
                      )}
                    >
                      {item.label}
                    </Button>
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-full bg-white shadow-sm border-none z-0"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-slate-100 border-none">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
