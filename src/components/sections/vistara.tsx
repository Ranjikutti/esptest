"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Vistara = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const [currentMascotIndex, setCurrentMascotIndex] = useState(0);
  const mascotImages = [
    "/mascot/mascot_normal_shadow.svg",
    "/mascot/mascot_hi_shadow.svg",
    "/mascot/mascot_party_shadow.svg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment to cycle normally (0 -> 1 -> 2 -> 0)
      // This ensures "Party" (index 2) hits center after "Hi" (index 1)
      setCurrentMascotIndex((prev) => (prev + 1) % mascotImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getMascotExploreProps = (index: number) => {
    // Calculate relative position based on current index
    // 0 = center, 1 = right, 2 = left (in a 3-item array)
    const position = (index - currentMascotIndex + mascotImages.length) % mascotImages.length;

    if (position === 0) {
      // Center
      return {
        x: '0%',
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 20
      };
    } else if (position === 1) {
      // Right
      return {
        x: '110%',
        scale: 0.7,
        opacity: 0.6,
        filter: 'blur(4px)',
        zIndex: 10
      };
    } else {
      // Left (position === 2 or -1 equivalent)
      return {
        x: '-110%',
        scale: 0.7,
        opacity: 0.6,
        filter: 'blur(4px)',
        zIndex: 10
      };
    }
  };


  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const isButtonInView = useInView(buttonRef, { once: true, amount: 0.8 });
  const buttonY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      cardsRef.current.forEach((card) => {
        if (!card) return;

        // 1. Sleek Card Entrance
        gsap.fromTo(card,
          {
            clipPath: "inset(50% 0 50% 0)",
            scale: 0.95,
            opacity: 0
          },
          {
            clipPath: "inset(0% 0 0% 0)",
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );

        // 2. The "Lyrics Reading" Effect
        const words = card.querySelectorAll('.read-word');
        if (words.length > 0) {
          gsap.fromTo(words,
            { opacity: 0.2, y: 5, filter: "blur(4px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.05,
              duration: 0.4,
              ease: "power2.out",
              color: "#ffffff",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "bottom 70%",
                scrub: 1,
              }
            }
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const spotlight = card.querySelector('.card-spotlight');
    const cardContent = card.querySelector('.card-content');

    if (spotlight) {
      gsap.to(spotlight, {
        background: `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`,
        duration: 0.3
      });
    }

    if (cardContent) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      gsap.to(cardContent, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const spotlight = card.querySelector('.card-spotlight');
    const cardContent = card.querySelector('.card-content');

    if (spotlight) {
      gsap.to(spotlight, {
        background: `radial-gradient(400px circle at 50% 50%, rgba(255,255,255,0), transparent 40%)`,
        duration: 0.5
      });
    }
    if (cardContent) {
      gsap.to(cardContent, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)"
      });
    }
  };

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const SplitText = ({ children, className }: { children: string; className?: string }) => {
    return (
      <>
        {children.split(" ").map((word, i) => (
          <span key={i} className={`read-word inline-block mr-1.5 ${className || ''}`}>
            {word}
          </span>
        ))}
      </>
    );
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#050505] py-16 md:py-24">

      {/* Background Ambience */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">

        {/* Button */}
        <motion.div
          ref={buttonRef}
          style={{ y: buttonY }}
          className="flex justify-center mb-16 md:mb-20"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
            animate={isButtonInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(138, 43, 226, 0.5)" }}
            className="group relative animate-shimmer rounded-full border-2 border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#3B1344,55%,#000103)] bg-[length:200%_100%] px-6 py-3 md:px-12 md:py-5 lg:px-24 lg:py-6 font-bricolage text-xl md:text-3xl lg:text-5xl font-black text-slate-400 transition-all focus:outline-none"
            style={{ fontFamily: "var(--font-bricolage)", letterSpacing: '-0.05em', transformStyle: 'preserve-3d' }}
          >
            <span className="relative z-10">Vistara Student Club</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl animate-[spin_3s_linear_infinite]" />
          </motion.button>
        </motion.div>

        {/* 2 Unique GSAP Cards with Optimized Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">

          {/* Card 1 */}
          <div
            ref={addToRefs}
            className="relative group cursor-default"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Spotlight */}
            <div className="card-spotlight absolute inset-0 z-20 rounded-[1.5rem] pointer-events-none transition-opacity duration-500" />

            <div className="card-content relative h-full rounded-[1.5rem] border-2 border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl p-6 md:p-10 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-[#29B463]/30">

              <div className="absolute top-0 right-0 w-48 h-48 bg-[#29B463]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full gap-6">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black font-bricolage leading-[0.95] text-white tracking-tighter text-center">
                  THE CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29B463] to-[#DAF7A5]">HEARTBEAT</span>
                </h3>

                <div className="h-[1px] w-full bg-gradient-to-r from-[#29B463]/50 to-transparent my-1" />

                <p className="text-lg md:text-xl font-bricolage font-medium leading-relaxed text-gray-500">
                  <SplitText className="text-[#29B463]">Vistara</SplitText>
                  <SplitText>is the creative heartbeat of our college. It's a space where talent meets passion and ideas turn into performances.</SplitText>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            ref={addToRefs}
            className="relative group cursor-default"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-spotlight absolute inset-0 z-20 rounded-[1.5rem] pointer-events-none transition-opacity duration-500" />

            <div className="card-content relative h-full rounded-[1.5rem] border-2 border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl p-6 md:p-10 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-[#FFC300]/30">

              <div className="absolute top-0 left-0 w-48 h-48 bg-[#FFC300]/10 rounded-full blur-[60px] -translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full gap-6">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black font-bricolage leading-[0.95] text-white tracking-tighter text-center">
                  PLATFORM TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC300] to-[#FF5733]">EVOLVE</span>
                </h3>

                <div className="h-[1px] w-full bg-gradient-to-r from-[#FFC300]/50 to-transparent my-1" />

                <p className="text-lg md:text-xl font-bricolage font-medium leading-relaxed text-gray-500">
                  <SplitText>We celebrate creativity in every form.</SplitText>
                  <SplitText>Whether it's a</SplitText>
                  <SplitText className="text-[#FFC300]">powerful performance</SplitText>
                  <SplitText>, soulful music, or stunning designs.</SplitText>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Mascot Section - Optimized Spacing */}
        <div className="mt-24 relative flex flex-col items-center justify-center [perspective:1000px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8 z-10"
          >
            <h3 className="text-lg md:text-xl font-bold tracking-[0.2em] mb-2 uppercase font-bricolage bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">Guess Who is Coming?</h3>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-bricolage text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 animate-gradient-x drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              ???
            </h2>
          </motion.div>

          {/* Optimized Mascot Size */}
          <motion.div
            className="relative w-[300px] h-[450px] md:w-[600px] md:h-[800px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 rounded-full blur-[60px] animate-pulse" />
            <div className="relative w-full h-full flex items-center justify-center">
              {mascotImages.map((src, index) => (
                <motion.div
                  key={index}
                  className="absolute w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] origin-bottom"
                  animate={getMascotExploreProps(index)}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Image
                    src={src}
                    alt={`Vizzy Mascot ${index}`}
                    fill
                    className="object-contain"
                    priority={index === currentMascotIndex}
                  />
                  <div className="absolute -bottom-10 left-[10%] w-[80%] h-4 bg-black/50 blur-xl rounded-[100%]" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center text-white/50 max-w-xl text-base md:text-lg font-bricolage"
          >
            Be Awaited...
          </motion.p>
        </div>

      </div>
    </section>
  );
};

export default Vistara;