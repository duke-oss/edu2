import Link from "next/link";
import { Rocket } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header */}
      <header className="py-6 px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Rocket size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Sellernote
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
