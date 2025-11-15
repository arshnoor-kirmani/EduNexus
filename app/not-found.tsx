import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold">🚧 Website Under Construction</h1>

      <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-md">
        This page is currently being built. We’re working hard — please check
        back soon!
      </p>
      <Link href="/">
        <Button className="mt-3 px-8 cursor-pointer">Go Back</Button>
      </Link>
    </div>
  );
}
