"use client";

import React from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  className?: string;
  particleDensity?: number;
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#FFFFFF",
  className = "",
  particleDensity = 100,
}: SparklesCoreProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    console.log(container);
  };

  if (init) {
    return (
      <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
        <Particles
          id={id}
          className="pointer-events-none"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background,
              },
            },
            particles: {
              color: {
                value: particleColor,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: speed,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: particleDensity,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: minSize, max: maxSize },
              },
            },
            interactivity: {
              events: {
                onClick: {
                  enable: false,
                },
                onHover: {
                  enable: false,
                },
              },
            },
          }}
        />
      </div>
    );
  }

  return <></>;
}; 