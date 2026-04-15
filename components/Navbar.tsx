import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { FileText, LogOut, User } from "lucide-react";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <FileText size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Ajaia Docs
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session?.user && (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700">
                  <User size={16} />
                  <span>{session.user.name || session.user.email}</span>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
