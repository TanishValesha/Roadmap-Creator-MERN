import { MapPinned, GitFork, CircleDot, ArrowRight } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 bg-primary p-8 flex flex-col justify-center items-center text-primary-foreground">
        <div className="max-w-md text-center md:text-left">
          <div className="mb-8 flex justify-center relative">
            {/* Custom Roadmap Illustration */}
            <div className="relative w-32 h-32">
              {/* Main circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPinned className="h-16 w-16 animate-pulse" />
              </div>
              {/* Orbital circles with dots */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <CircleDot className="h-6 w-6" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <CircleDot className="h-6 w-6" />
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <CircleDot className="h-6 w-6" />
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                  <CircleDot className="h-6 w-6" />
                </div>
              </div>
              {/* Connecting lines */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 h-px w-full -translate-y-1/2 -translate-x-1/2 bg-primary-foreground opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 h-full w-px -translate-y-1/2 -translate-x-1/2 bg-primary-foreground opacity-20"></div>
              </div>
              {/* Corner decorations */}
              <GitFork className="absolute top-0 right-0 h-8 w-8 -rotate-45" />
              <ArrowRight className="absolute bottom-0 left-0 h-8 w-8 rotate-45" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">RoadMap Builder</h1>
          <p className="text-lg opacity-90">
            Create and share beautiful roadmaps to guide others on their
            learning journey. Join our community of knowledge sharers today.
          </p>
        </div>
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
