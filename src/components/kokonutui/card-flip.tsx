"use client";

/**
 * @author: @dorianbaffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ArrowRight, Repeat2 } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  actionLabel?: string;
  onAction?: () => void;
  videoSrc?: string;
  imageSrc?: string;
}

export default function CardFlip({
  title = "Design Systems",
  subtitle = "Explore the fundamentals",
  description = "Dive deep into the world of modern UI/UX design.",
  features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
  actionLabel = "Start today",
  onAction,
  videoSrc,
  imageSrc,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "100px" });

  return (
    <div
      ref={containerRef}
      className="group relative h-[380px] w-full [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(true)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl",
            "bg-zinc-600 dark:bg-zinc-700", // Gray Border
            "p-[2px]", // Border width 2
            "shadow-xs dark:shadow-lg",
            "transition-all duration-700",
            "group-hover:shadow-lg dark:group-hover:shadow-xl",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-black">
            <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
              {videoSrc && isInView ? (
                <>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-start justify-center pt-24">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="relative flex h-[100px] w-[200px] items-center justify-center">
                      {[...Array(10)].map((_, i) => (
                        <div
                          className={cn(
                            "absolute h-[50px] w-[50px]",
                            "rounded-[140px]",
                            "animate-[scale_3s_linear_infinite]",
                            "opacity-0",
                            "shadow-[0_0_50px_rgba(255,165,0,0.5)]",
                            "group-hover:animate-[scale_2s_linear_infinite]"
                          )}
                          key={i}
                          style={{
                            animationDelay: `${i * 0.3}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="absolute right-0 bottom-0 left-0 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className={cn(
                    "font-bold text-xl lg:text-2xl leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]",
                    "bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent"
                  )}>
                    {title}
                  </h3>
                  <p className={cn(
                    "line-clamp-2 text-base lg:text-lg tracking-tight transition-all delay-[50ms] duration-500 ease-out-expo group-hover:translate-y-[-4px]",
                    videoSrc ? "text-white/80" : "text-zinc-600 dark:text-zinc-200",
                    "font-bricolage"
                  )}
                    style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                  >
                    {subtitle}
                  </p>
                </div>
                <div className="group/icon relative">
                  <div
                    className={cn(
                      "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                      "bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent"
                    )}
                  />
                  <Repeat2 className="group-hover/icon:-rotate-12 relative z-10 h-4 w-4 text-orange-500 transition-transform duration-300 group-hover/icon:scale-110" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "rounded-2xl p-[2px]", // Padding for border
            "bg-zinc-600 dark:bg-zinc-700", // Gray Border
            "shadow-xs dark:shadow-lg",
            "flex flex-col",
            "transition-all duration-700",
            "group-hover:shadow-lg dark:group-hover:shadow-xl",
            isFlipped ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative h-full w-full rounded-[14px] bg-[#0c0c0c] p-6 flex flex-col">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-xl lg:text-2xl leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent">
                  {title}
                </h3>
                <p
                  className="line-clamp-2 text-sm lg:text-base text-zinc-300 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {description}
                </p>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[160px] pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-thumb-rounded-full" style={{ fontFamily: '"Inter", sans-serif' }}>
                {features.map((feature, index) => (
                  <div
                    className="flex items-start gap-2 text-sm lg:text-base text-zinc-300 transition-all duration-500"
                    key={feature}
                    style={{
                      transform: isFlipped
                        ? "translateX(0)"
                        : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <ArrowRight className="h-3 w-3 mt-1 text-orange-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
              <div className="border-t-0 pt-6">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.();
                    setIsFlipped(false);
                  }}
                  className={cn(
                    "group/start relative",
                    "flex items-center justify-between",
                    "-m-3 rounded-xl p-3",
                    "overflow-hidden",
                    "bg-zinc-100 dark:bg-zinc-800",
                    "hover:cursor-pointer"
                  )}
                >
                  <div className="absolute inset-0 opacity-0 group-hover/start:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500/20 to-transparent" />
                  <span
                    className="relative z-10 font-medium text-base text-zinc-900 transition-colors duration-300 group-hover/start:text-orange-600 dark:text-white dark:group-hover/start:text-orange-400 font-bricolage"
                    style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
                  >
                    {actionLabel}
                  </span>
                  <div className="group/icon relative z-10">
                    <ArrowRight className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style jsx>{`
                @keyframes scale {
                    0% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0px 0px 50px rgba(255, 165, 0, 0.5);
                    }
                    50% {
                        transform: translate(0px, -5px) scale(1);
                        opacity: 1;
                        box-shadow: 0px 8px 20px rgba(255, 165, 0, 0.5);
                    }
                    100% {
                        transform: translate(0px, 5px) scale(0.1);
                        opacity: 0;
                        box-shadow: 0px 10px 20px rgba(255, 165, 0, 0);
                    }
                }
            `}</style>
    </div>
  );
}
