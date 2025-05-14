"use client";

import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function SparklesBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#FFFFFF"
        speed={0.5}
      />
    </div>
  );
} 