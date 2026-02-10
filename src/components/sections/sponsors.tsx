"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { InfiniteRibbon } from "../ui/infinite-ribbon";

const marqueeItems = [
  "Opportunity", "Exposure", "Visibility", "Branding", "Engagement",
  "Collaboration", "Impact", "Influence", "Reach", "Recognition",
  "Partnership", "Audience", "Connection", "Leadership", "Innovation",
  "Growth", "Exclusivity", "Prestige", "Momentum", "Trust"
];

const Sponsors = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const sponsorsRef = useRef(null);

  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const isSponsorsInView = useInView(sponsorsRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sponsorY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div className="my-8 min-h-screen w-full overflow-hidden bg-background" id="sponsors">
      <InfiniteRibbon words={marqueeItems} />

      <section ref={sectionRef} className="pb-[1rem] pt-[4rem] md:pt-[7rem] px-2">
        <motion.h2
          ref={titleRef}
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          animate={isTitleInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] flex justify-center text-center font-bricolage text-2xl md:text-4xl lg:text-5xl font-black mb-8 md:mb-8 tracking-tighter"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          OUR SPONSORS
        </motion.h2>

        <motion.section
          style={{ y: sponsorY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isTitleInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex scale-90 flex-col items-center justify-center py-[1rem] font-bricolage text-white"
        >
          <h3 className="text-sm md:text-xl lg:text-3xl font-black tracking-tight mb-4 md:mb-8 bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">TITLE SPONSOR</h3>
          <motion.div
            className="fade-image px-4 md:px-8 py-4 md:py-8 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-32 md:w-48 lg:w-72 h-32 md:h-48 lg:h-72 rounded-2xl border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-3 md:gap-4 ">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg className="w-12 h-12 md:w-16 md:h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.div>
              <p className="text-white/60 font-bold text-sm md:text-lg lg:text-xl">COMING SOON</p>
            </div>
          </motion.div>
        </motion.section>

        <section ref={sponsorsRef} className="flex flex-col justify-around lg:flex-row lg:gap-8 mt-8 md:mt-12">
          {[
            { title: "MEDIA SPONSOR" },
            { title: "TELEVISION PARTNER" },
            { title: "RADIO PARTNER" },
          ].map((sponsor, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
              animate={isSponsorsInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center justify-center pb-6 md:pb-8 font-bricolage text-white"
            >
              <h4 className="pb-2 md:pb-4 text-xs md:text-lg lg:text-2xl font-black tracking-tight bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">{sponsor.title}</h4>
              <motion.div
                className="fade-image h-28 md:h-40 lg:h-52 px-4 md:px-8 py-4 md:py-6 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-40 md:w-56 lg:w-72 h-full rounded-xl border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-2 md:gap-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </motion.div>
                  <p className="text-white/60 font-bold text-xs md:text-sm lg:text-base">COMING SOON</p>
                </div>
              </motion.div>
            </motion.section>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={isSponsorsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col items-center justify-center pb-10 md:pb-16 font-bricolage text-white"
        >
          <h4 className="text-xs md:text-lg lg:text-2xl font-black tracking-tight opacity-80 bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">OTHER SPONSORS</h4>
        </motion.section>
      </section>
    </div>
  );
};

export default Sponsors;