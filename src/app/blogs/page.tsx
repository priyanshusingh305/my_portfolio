import Image from "next/image";
import React from "react";

export default function BlogsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 px-6">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-light  tracking-tight">
            Blogs
          </h1>
          <p className=" text-lg font-light max-w-md mx-auto leading-relaxed">
            Thoughts, stories, and ideas worth sharing
          </p>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="w-64 h-64 mx-auto rounded-full overflow-hidden shadow-2xl ring-1">
            <Image 
              src="/2.png" 
              alt="Blog illustration" 
              width={256} 
              height={256}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Coming Soon */}
        <div className="space-y-3">
          <p className=" font-light">
            Coming Soon
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </main>
  );
}