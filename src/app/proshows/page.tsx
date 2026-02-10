"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/sections/header';
import MobileNav from '@/components/sections/MobileNav';
import Footer from '@/components/sections/footer';

const proshows = [
  {
    day: "Day 1",
    date: "26 FEB",
    title: "Opening Night",
    artists: [
      { name: "Armaan Malik", role: "Playback Singer", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/RahulChahar_ac750ab2-opt-1080-15.webp" },
      { name: "Shakthisree Gopalan", role: "Singer", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/NagaChai_e032696b-opt-750-22.webp" },
    ],
    color: "#29B463"
  },
  {
    day: "Day 2",
    date: "27 FEB",
    title: "EDM Night",
    artists: [
      { name: "Progressive Brothers", role: "DJ Duo", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/loststories-23.webp" },
      { name: "Julia Bliss", role: "International DJ", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/danika-24.webp" },
    ],
    color: "#FFC300"
  },
  {
    day: "Day 3",
    date: "28 FEB",
    title: "Bollywood Beats",
    artists: [
      { name: "Devi Sri Prasad", role: "Music Director", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/andrea-25.webp" },
      { name: "Aastha Gill", role: "Singer", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/jonita-26.webp" },
    ],
    color: "#FF5733"
  },
  {
    day: "Day 4",
    date: "1 MAR",
    title: "Grand Finale",
    artists: [
      { name: "Shreya Ghoshal", role: "Playback Singer", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/shreya-27.webp" },
      { name: "Lost Stories", role: "DJ Duo", image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/loststories-23.webp" },
    ],
    color: "#DAF7A5"
  },
];

function ShowCard({ show, showIndex }: { show: typeof proshows[0]; showIndex: number }) {
  const showRef = useRef(null);
  const isShowInView = useInView(showRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={showRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isShowInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isShowInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/4"
        >
          <div
            className="inline-block px-6 py-2 rounded-full font-bold text-black mb-4"
            style={{ backgroundColor: show.color }}
          >
            {show.day}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-2">
            {show.date}
          </h2>
          <p className="text-2xl md:text-3xl font-bold" style={{ color: show.color }}>
            {show.title}
          </p>
        </motion.div>

        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {show.artists.map((artist, artistIndex) => (
            <motion.div
              key={artistIndex}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isShowInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + artistIndex * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{artist.name}</h3>
                <p className="text-white/70">{artist.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showIndex < proshows.length - 1 && (
        <div className="w-full h-px bg-white/10 mt-20" />
      )}
    </motion.div>
  );
}

export default function ProShowsPage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="grainy-overlay" />
      <MobileNav />
      <Header />

      <section className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div ref={heroRef} className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                width="40" height="40" viewBox="0 0 24 24" className="text-festival-orange"
              >
                <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </motion.svg>
              <h1 className="font-power text-[12vw] md:text-[10vw] lg:text-[150px] font-black tracking-tighter leading-none text-festival-yellow">
                PRO SHOWS
              </h1>
              <motion.svg
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                width="40" height="40" viewBox="0 0 24 24" className="text-festival-orange"
              >
                <path fill="currentColor" d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </motion.svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto"
            >
              Four nights of electrifying performances by the biggest names in music
            </motion.p>
          </motion.div>

          <div className="space-y-20">
            {proshows.map((show, showIndex) => (
              <ShowCard key={showIndex} show={show} showIndex={showIndex} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24 text-center"
          >
            <motion.a
              href="https://drive.google.com/file/d/178-_OyFP-BL9VQ1h_wkBRa3GsV0BvXma/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-12 py-4 rounded-xl bg-festival-green text-black font-bold text-lg hover:bg-festival-green/90 transition-colors"
            >
              Download Full Schedule
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}