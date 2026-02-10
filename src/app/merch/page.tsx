"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/sections/header';
import MobileNav from '@/components/sections/MobileNav';
import Footer from '@/components/sections/footer';

const merchItems = [
  {
    name: "Esperanza Oversized Tee",
    price: "₹599",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/logo_low_fe195da3-opt-640-1.webp",
    color: "#29B463"
  },
  {
    name: "Esperanza Hoodie",
    price: "₹999",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/logo_low_fe195da3-opt-640-1.webp",
    color: "#FFC300"
  },
  {
    name: "Limited Edition Cap",
    price: "₹349",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/logo_low_fe195da3-opt-640-1.webp",
    color: "#FF5733"
  },
  {
    name: "Festival Wristband Set",
    price: "₹199",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/logo_low_fe195da3-opt-640-1.webp",
    color: "#DAF7A5"
  },
  {
    name: "Esperanza Tote Bag",
    price: "₹299",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/logo_low_fe195da3-opt-640-1.webp",
    color: "#29B463"
  },
  {
    name: "Exclusive Poster Pack",
    price: "₹249",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/images/logo_low_fe195da3-opt-640-1.webp",
    color: "#FFC300"
  },
];

export default function MerchPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });

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
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-power text-[15vw] md:text-[12vw] lg:text-[180px] font-black tracking-tighter leading-none text-gradient-festival"
            >
              MERCH
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto"
            >
              Exclusive Esperanza 2k26 merchandise. Wear your festival spirit!
            </motion.p>
          </motion.div>

          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={isGridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10 cursor-pointer"
              >
                <div
                  className="aspect-square relative overflow-hidden"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div
                    className="absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-black text-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    Coming Soon
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isGridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <p className="text-white/60 text-lg mb-6">Get notified when merch drops</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-festival-green"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl bg-festival-green text-black font-bold hover:bg-festival-green/90 transition-colors"
              >
                Notify Me
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}