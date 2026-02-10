"use client";

import { motion } from "framer-motion";

export default function GalleryIntro() {
  return (
    <section className="relative h-[70vh] flex flex-col items-center justify-center overflow-hidden w-full">
      <div className="flex flex-col items-center justify-center z-10 px-4 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[20vw] md:text-[15vw] lg:text-[180px] font-black tracking-tighter leading-none text-center select-none uppercase font-bricolage bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] px-2"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          GALLERY
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-4 md:mt-6 text-xs sm:text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] font-medium uppercase text-muted-foreground/90 font-bricolage text-center max-w-[90%] md:max-w-none"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          Where Esperanza Comes Alive in Motion
        </motion.p>
      </div>

      {/* Minimal Scroll Indicator */}

    </section>
  );
}
