import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { AppData } from "@/config/appConfig";

export default function Footer() {
  return (
    <footer className="border-t bg-background w-full">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
        {/* === Left Section === */}
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()}</span>
          <Link
            href="/"
            className="font-semibold text-foreground hover:text-primary transition-colors"
          >
            {AppData.app.name}
          </Link>
          <span>· All rights reserved.</span>
        </div>

        {/* === Divider for mobile === */}
        <Separator className="md:hidden w-full" />

        {/* === Right Section === */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Support
          </Link>
          <Link
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="hover:text-primary transition-colors duration-200"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
