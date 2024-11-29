import React from "react";
import {
  GitBranch,
  Share2,
  Users,
  Layout,
  Clock,
  Lock,
  ScanEye,
} from "lucide-react";

const features = [
  {
    name: "Visual Path Builder",
    description:
      "Create beautiful, branching learning paths with our intuitive drag-and-drop interface.",
    icon: GitBranch,
  },
  {
    name: "Easy Sharing",
    description:
      "Share your roadmaps with anyone by publically saving the roadmaps. ",
    icon: Share2,
  },
  {
    name: "Collaboration",
    description:
      "Work together with your team to create and maintain learning paths.",
    icon: Users,
  },
  {
    name: "Progress Tracking",
    description:
      "Track learning progress and milestone completion in real-time.",
    icon: Clock,
  },
  {
    name: "Private Roadmaps",
    description: "Keep your roadmaps private or share them with the world.",
    icon: Lock,
  },
  {
    name: "Increase Focus",
    description: "Focus on specific and particular topics",
    icon: ScanEye,
  },
];

export function Features() {
  return (
    <div id="features" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create perfect roadmaps
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
