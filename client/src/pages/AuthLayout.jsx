import { MapPinned, GitFork, CircleDot, ArrowRight } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 bg-primary p-8 flex flex-col justify-center items-center text-primary-foreground space-y-8">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">Mapper - RoadMap Builder</h1>
          <p className="text-lg opacity-90">
            Create and share beautiful roadmaps to guide others on their
            learning journey. Join our community of knowledge sharers today.
          </p>
        </div>
        <img src="illustration.png" alt="Image" className="w-[80%]" />
      </div>

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
