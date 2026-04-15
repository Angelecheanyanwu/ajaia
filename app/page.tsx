import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, ArrowRight, Shield, Zap, Users } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] selection:bg-blue-100 selection:text-blue-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32 sm:pt-24 sm:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            
            <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
              Collaborate with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                AI-Native Speed
              </span>
            </h1>
            
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              The lightweight, collaborative document editor designed for fast-moving teams. 
              Rich-text formatting, easy sharing, and seamless file imports.
            </p>

            <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              
              <div className="relative">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Welcome Back</h2>
                
                <form
                  action={async (formData) => {
                    "use server";
                    await signIn("credentials", formData);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1 text-left">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                    <input
                      name="email"
                      type="text"
                      required
                      placeholder="e.g. somtoecheanyanwu"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/50"
                    />
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      defaultValue="123"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                  >
                    Get Started
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                    * For this evaluation, using any email will auto-create a persistent account. Default password is <span className="font-mono font-bold text-gray-600">123</span>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Rich-Text Editor</h3>
              <p className="text-gray-500 leading-relaxed">
                A seamless editing experience with bold, italic, headings, and lists. Focus on your content without distractions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Effortless Sharing</h3>
              <p className="text-gray-500 leading-relaxed">
                Collaborate instantly. Grant access to teammates via email and distinguish between owned and shared documents.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Secure & Persistent</h3>
              <p className="text-gray-500 leading-relaxed">
                Your work is always saved and preserved. Built with industry-standard persistence to ensure your data stays yours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-400 font-medium tracking-wide">
        &copy; Angel Echeanyanwu AI-NATIVE FULL STACK ASSIGNMENT
      </footer>
    </div>
  );
}
