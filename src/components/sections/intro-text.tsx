"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const IntroTextSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Text items to display sequentially
  const textItems = [
    { text: "One Epic Day", color: "#29B463", weight: "font-black" },
    { text: "Shimmering Talents", color: "#DAF7A5", weight: "font-bold" },
    { text: "Power-Packed Events", color: "#FFC300", weight: "font-bold" },
    { text: "Electrifying Performances", color: "#FF5733", weight: "font-bold" },
    { text: "Unforgettable Moments", color: "#29B463", weight: "font-bold" },
    { text: "Pure Passion", color: "#FFC300", weight: "font-black" },
  ];

  const totalItems = textItems.length;

  return (
    <section
      id="intro-section"
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${totalItems * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-purple-600/10 rounded-full blur-[100px] opacity-100" />

        {/* Text Container with 3D perspective */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div className="relative w-full max-w-6xl px-6">
            {textItems.map((item, index) => {
              // Calculate scroll range for this item
              const itemStart = index / totalItems;
              const itemEnd = (index + 1) / totalItems;
              const itemMid = (itemStart + itemEnd) / 2;

              // Opacity: fade in, stay visible, fade out
              const opacity = useTransform(
                scrollYProgress,
                [
                  Math.max(0, itemStart - 0.05),
                  itemStart + 0.05,
                  itemEnd - 0.05,
                  Math.min(1, itemEnd + 0.05)
                ],
                [0, 1, 1, 0]
              );

              // Y position: slide up and out
              const y = useTransform(
                scrollYProgress,
                [itemStart, itemMid, itemEnd],
                [100, 0, -100]
              );

              // Scale: grow in, shrink out
              const scale = useTransform(
                scrollYProgress,
                [itemStart, itemMid, itemEnd],
                [0.8, 1, 0.8]
              );

              // Rotation X: 3D flip effect
              const rotateX = useTransform(
                scrollYProgress,
                [itemStart, itemMid, itemEnd],
                [45, 0, -45]
              );

              // Blur: sharp in center, blurred at edges
              const blur = useTransform(
                scrollYProgress,
                [itemStart, itemMid, itemEnd],
                [4, 0, 4]
              );

              return (
                <motion.div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center text-center font-display ${item.weight}`}
                  style={{
                    opacity,
                    y,
                    scale,
                    rotateX,
                    filter: useTransform(blur, (b) => `blur(${b}px)`),
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                >
                  <h2
                    className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight font-bricolage bg-gradient-to-b from-white via-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                  >
                    {item.text}
                  </h2>
                </motion.div>
              );
            })}
          </div>
        </div>




      </div>
    </section>
  );
};

export default IntroTextSection;