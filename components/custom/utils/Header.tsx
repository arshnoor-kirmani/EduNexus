"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppData } from "@/config/appConfig";

// Navigation links
const details = AppData.header.landing;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/60 shadow-sm"
          : "bg-background/60 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* === Left: Logo === */}
        <LogoLink name={AppData.app.name} iconUrl={AppData.app.icon} />

        {/* === Right: Navigation === */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-5">
              {details.links.map((link, i) => (
                <NavigationMenuItem key={i}>
                  <NavigationMenuLink
                    href={link.href}
                    className="font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Theme Toggle */}
          <ThemeToggle variant="ghost" />

          {/* CTA Button */}
          <Link href={details.actions[0].href}>
            <Button className="hidden sm:inline-flex shadow-sm hover:shadow-md text-sm px-4">
              {details.actions[0].title}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/* ======================= Mobile Menu ======================= */
function MobileMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open menu"
          className="md:hidden p-0 w-9 h-9 flex items-center justify-center"
          variant="ghost"
          size="icon"
        >
          {/* Hamburger Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-56 mt-2 p-2 rounded-xl border border-border/40 shadow-lg bg-background/95 backdrop-blur-sm"
      >
        <NavigationMenu className="max-w-none w-full">
          <NavigationMenuList className="flex flex-col items-start gap-1">
            {details.links.map((link, i) => (
              <NavigationMenuItem key={i} className="w-full">
                <NavigationMenuLink
                  href={link.href}
                  className="block w-full py-2 px-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
                >
                  {link.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <div className="border-t border-border/40 w-full my-2" />

            <Link href="/auth/create-institute-account" className="w-full">
              <Button className="w-full text-sm">Get Started</Button>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}

/* ======================= Logo Component ======================= */
export function LogoLink({ name, iconUrl }: { name: string; iconUrl: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-1 group transition-all duration-200  rounded-md"
      )}
    >
      <Avatar className="">
        <AvatarImage
          src={iconUrl || "/icon.png"} // replace with your EduNexus logo icon
          alt={`${name} Icon`}
          className="object-contain"
        />
        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <span
        className={cn(
          "font-semibold text-base md:text-xl text-foreground leading-none tracking-tight",
          "group-hover:text-primary transition-colors"
        )}
      >
        {name}
      </span>
    </Link>
  );
}
