"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GridItemConfig<T> {
  getId: (item: T) => string | number;
  getImageUrl: (item: T) => string;
  getTitle: (item: T) => string;
  getDescription: (item: T) => string;
  getPrice?: (item: T) => number;
  formatPrice?: (price: number) => string;
  onActionClick?: (item: T) => void;
  actionIcon?: React.ReactNode;
  getNavigationUrl?: (item: T) => string;
}

interface GenericGridProps<T> {
  items: T[];
  config: GridItemConfig<T>;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

const defaultFormatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export function GenericGrid<T>({
  items,
  config,
  columns = { sm: 2, md: 2, lg: 4, xl: 4 },
  className,
}: GenericGridProps<T>) {
  const router = useRouter();
  const {
    getId,
    getImageUrl,
    getTitle,
    getDescription,
    getPrice,
    formatPrice = defaultFormatPrice,
    onActionClick,
    actionIcon = <ShoppingCart className="h-4 w-4 text-white" />,
    getNavigationUrl,
  } = config;

  const getGridClass = () => {
    const classes = ["grid", "grid-cols-1", "gap-6"];

    if (columns.sm === 2) classes.push("sm:grid-cols-2");
    else if (columns.sm === 3) classes.push("sm:grid-cols-3");
    else if (columns.sm === 4) classes.push("sm:grid-cols-4");

    if (columns.md === 2) classes.push("md:grid-cols-2");
    else if (columns.md === 3) classes.push("md:grid-cols-3");
    else if (columns.md === 4) classes.push("md:grid-cols-4");

    if (columns.lg === 4) classes.push("lg:grid-cols-4");
    else if (columns.lg === 3) classes.push("lg:grid-cols-3");
    else if (columns.lg === 2) classes.push("lg:grid-cols-2");

    if (columns.xl === 4) classes.push("xl:grid-cols-4");
    else if (columns.xl === 3) classes.push("xl:grid-cols-3");
    else if (columns.xl === 5) classes.push("xl:grid-cols-5");
    else if (columns.xl === 6) classes.push("xl:grid-cols-6");

    return classes.join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(getGridClass(), className)}
    >
      {items.map((item) => {
        const id = getId(item);
        const price = getPrice?.(item);
        const navigationUrl = getNavigationUrl?.(item);
        const isClickable = !!navigationUrl;

        const handleCardClick = () => {
          if (navigationUrl) {
            router.push(navigationUrl);
          }
        };

        const handleActionClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (onActionClick) {
            onActionClick(item);
          }
        };

        return (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg",
              isClickable && "cursor-pointer"
            )}
            onClick={handleCardClick}
          >
            <div className="aspect-4/3 w-full overflow-hidden bg-slate-100">
              <Image
                src={getImageUrl(item)}
                alt={getTitle(item)}
                width={200}
                height={120}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col p-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {getTitle(item)}
              </h3>

              <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                {getDescription(item)}
              </p>

              <div className="mt-3 flex items-center justify-between">
                {price !== undefined ? (
                  <span className="text-base font-bold">
                    {formatPrice(price)}
                  </span>
                ) : (
                  <div />
                )}

                {onActionClick && (
                  <Button
                    size="icon"
                    onClick={handleActionClick}
                    className="h-6 w-6 rounded-full bg-primary hover:bg-primary/90"
                  >
                    {actionIcon}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
