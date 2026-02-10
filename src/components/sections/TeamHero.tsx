"use client";

import React from 'react';
import { motion } from 'framer-motion';

import { 
  Puzzle, 
  Trophy, 
  Smile, 
  Gamepad2, 
  DoorOpen, 
  Box, 
  LayoutGrid, 
  Hash, 
  Gem 
} from 'lucide-react';

export default function TeamHero() {
  return (
    <div className="relative w-full min-h-[50vh] md:h-[75vh] flex items-center justify-center overflow-hidden mb-8 md:mb-12 py-10 md:py-0">
      {/* Central Text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-4"
      >
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight font-bricolage bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]" 
          style={{ 
            fontFamily: '"Bricolage Grotesque", sans-serif' 
          }}
        >
          The minds and muscle <br />
          <span>behind</span> <br />
          Esperanza’26
        </h1>
      </motion.div>

      {/* Floating Icons - Circular Arrangement matching reference */}
      
      {/* Top Left - Puzzle */}
      <FloatingIcon 
        Icon={Puzzle} 
        initialX={-100} initialY={-100} 
        delay={0} 
        className="absolute left-[10%] md:left-[20%] top-[10%] md:top-[15%] text-white/40" 
        size={32}
      />

      {/* Top Left-Center - Gamepad */}
      <FloatingIcon 
        Icon={Gamepad2} 
        initialX={-50} initialY={-120} 
        delay={1.2} 
        className="absolute left-[25%] md:left-[35%] top-[5%] text-white/40" 
        size={32}
      />

      {/* Top Right-Center - Hash */}
      <FloatingIcon 
        Icon={Hash} 
        initialX={50} initialY={-120} 
        delay={0.8} 
        className="absolute right-[25%] md:right-[35%] top-[5%] text-white/40" 
        size={32}
      />

      {/* Top Right - Smile */}
      <FloatingIcon 
        Icon={Smile} 
        initialX={100} initialY={-100} 
        delay={0.5} 
        className="absolute right-[10%] md:right-[20%] top-[10%] md:top-[15%] text-white/40" 
        size={32}
      />
      
      {/* Right - Gem */}
      <FloatingIcon 
        Icon={LayoutGrid} 
        initialX={150} initialY={0} 
        delay={1} 
        className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 text-white/40" 
        size={32}
      />
      
       {/* Bottom Right - Door/Box */}
       <FloatingIcon 
        Icon={Box} 
        initialX={100} initialY={100} 
        delay={1.5} 
        className="absolute right-[10%] md:right-[20%] bottom-[10%] md:bottom-[15%] text-white/40" 
        size={32}
      />

      {/* Bottom Center - Gem */}
      <FloatingIcon 
        Icon={Gem} 
        initialX={0} initialY={150} 
        delay={2} 
        className="absolute bottom-[20%] md:bottom-[10%] left-[55%] -translate-x-1/2 text-white/40" 
        size={32}
      />

       {/* Bottom Left - Trophy */}
       <FloatingIcon 
        Icon={Trophy} 
        initialX={-100} initialY={100} 
        delay={2.5} 
        className="absolute left-[10%] md:left-[20%] bottom-[10%] md:bottom-[15%] text-white/40" 
        size={32}
      />

      {/* Left - DoorOpen */}
      <FloatingIcon 
        Icon={DoorOpen} 
        initialX={-150} initialY={0} 
        delay={3} 
        className="absolute left-[5%] md:left-[10%] top-1/2 -translate-y-1/2 text-white/40" 
        size={32}
      />
      
    </div>
  );
}

function FloatingIcon({ 
  Icon, 
  initialX, 
  initialY, 
  delay, 
  className,
  size = 48
}: { 
  Icon: React.ElementType; 
  initialX: number; 
  initialY: number; 
  delay: number;
  className?: string;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ x: initialX, y: initialY, opacity: 0, rotate: -20 }}
      animate={{ 
        x: 0, 
        y: 0, 
        opacity: 1, 
        rotate: 0,
        transition: { duration: 1.5, delay, ease: "easeOut" }
      }}
      className={className}
    >
      <motion.div
        animate={{ 
          y: [-10, 10, -10],
          rotate: [-5, 5, -5]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: Math.random() * 2 
        }}
      >
        <Icon size={size} strokeWidth={1} className="w-8 h-8 md:w-12 md:h-12" />
      </motion.div>
    </motion.div>
  );
}
