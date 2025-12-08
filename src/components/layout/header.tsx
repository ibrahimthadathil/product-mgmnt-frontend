"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ShoppingCart, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { navItems } from "@/const/navItems";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const { itemCount, clearCart } = useCartStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      });
    } else if (status === "unauthenticated") {
      clearUser();
      clearCart();
    }
  }, [session, status, setUser, clearUser, clearCart]);

  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (item.path === "/product") {
        return user?.role === "admin";
      }
      if (item.path === "/login") {
        return !isAuthenticated;
      }
      return true;
    });
  }, [user?.role, isAuthenticated]);

  const isActive = (path: string) => {
    if (path === "/shop") {
      return pathname === "/shop" || pathname?.startsWith("/shop/");
    }
    return pathname === path;
  };

  const handleLogout = async () => {
    clearUser();
    clearCart();
    await signOut({ callbackUrl: "/login" });
  };

  const initials = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";

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
            {filteredNavItems.map((item) => {
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
                        active ? "text-slate-900" : "text-slate-600"
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
          {mounted && (
            <Link href="/cart" className="relative">
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-slate-100 border-none">
            <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-semibold text-blue-500">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {mounted && isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2  border-slate-200 hover:border-slate-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {initials || <User2 className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold leading-5 text-slate-900">
                      {user?.name || "Profile"}
                    </span>
                    {user?.role && (
                      <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {mounted && !isAuthenticated && (
            <Button onClick={() => router.push("/login")} variant="outline" className="px-4">
              Login
          </Button>
          )}
        </div>
      </div>
    </header>
  );
};
