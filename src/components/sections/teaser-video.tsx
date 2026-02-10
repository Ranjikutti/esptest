"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TeaserVideo = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="bg-black w-full overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 md:py-16">
        <div className="mb-4 sm:mb-6 md:mb-10">
          <motion.h3
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
            className="see-you-text font-bricolage font-bold text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-white normal-case tracking-normal mb-1 sm:mb-2 md:mb-4 text-center sm:text-left"
          >
            See you at
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="see-you-at-vibrance-effect relative font-bricolage font-black tracking-tight leading-[0.85] text-white text-[12vw] sm:text-[11vw] md:text-[14vw] lg:text-[120px] xl:text-[140px] uppercase text-center sm:text-left"
          >
            <span
              className="block text-[12vw] lg:text-[120px] font-black tracking-tight leading-none text-left select-none bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] uppercase font-bricolage px-2"
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            >
              Esperanza&apos;26
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full aspect-video overflow-hidden rounded-md md:rounded-lg shadow-2xl"
        >
          <video
            className="video h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src="/videos/Esperanza%20Loading%20Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeaserVideo;