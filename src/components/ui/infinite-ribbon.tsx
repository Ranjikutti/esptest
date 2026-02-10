"use client";

import React from "react";
import { motion } from "framer-motion";

interface InfiniteRibbonProps {
    texts: string[];
    rotation?: number;
    direction?: "left" | "right";
    className?: string;
    backgroundColor?: string;
}

const Ribbon = ({ texts, rotation = 0, direction = "left", className = "", backgroundColor = "bg-white" }: InfiniteRibbonProps) => {
    return (
        <div
            className={`absolute left-0 w-[150%] -ml-[25%] flex overflow-hidden py-3 text-black shadow-lg ${className} ${backgroundColor}`}
            style={{
                transform: `rotate(${rotation}deg)`,
                zIndex: 10,
            }}
        >
            <motion.div
                className="flex min-w-full shrink-0 items-center justify-around gap-8 whitespace-nowrap"
                animate={{
                    x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 120,
                }}
            >
                {texts.concat(texts).concat(texts).map((text, idx) => (
                    <span key={idx} className="font-bricolage text-base md:text-2xl font-bold flex items-center">
                        {text} <span className="mx-4 text-black">•</span>
                    </span>
                ))}
            </motion.div>
            <motion.div
                className="flex min-w-full shrink-0 items-center justify-around gap-8 whitespace-nowrap"
                animate={{
                    x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 120,
                }}
            >
                {texts.concat(texts).concat(texts).map((text, idx) => (
                    <span key={`dup-${idx}`} className="font-bricolage text-base md:text-2xl font-bold flex items-center">
                        {text} <span className="mx-4 text-black">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

interface InfiniteCrossedRibbonsProps {
    words: string[];
}

export const InfiniteRibbon = ({ words }: InfiniteCrossedRibbonsProps) => {
    return (
        <div className="relative w-full h-[120px] md:h-[180px] overflow-hidden flex items-center justify-center my-6 md:my-10">
            <Ribbon texts={words} rotation={5} direction="left" backgroundColor="bg-gradient-to-r from-purple-400 to-white" />
            <Ribbon texts={words} rotation={-5} direction="right" backgroundColor="bg-gradient-to-r from-white to-purple-400" />
        </div>
    );
};
