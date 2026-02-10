"use client";

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const Footer = ({ onBackToTop }: { onBackToTop?: () => void }) => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const dividerVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.2 }
    },
  };

  const socialAssets = [
    {
      name: 'vistara',
      url: 'https://www.instagram.com/vistara_vtmt/',
      icon: '/vistara.svg'
    },
    {
      name: 'Instagram',
      url: 'http://instagram.com/esperanza_2k26_/',
      icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/svgs/insta-colored_b7ce9091-14.svg'
    },
    {
      name: 'vtmt',
      url: 'https://www.veltechmultitech.org/',
      icon: '/vtmt.ico'
    },
  ];

  return (
    <footer ref={footerRef} className="relative bg-[#050505] text-white py-8 md:py-16 px-4 md:px-12 lg:px-24 overflow-hidden font-sans border-t border-white/5">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-full max-w-[1920px] mx-auto"
      >
        {/* Cinematic Title */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-16 flex justify-center">
          <h1
            className="text-[11vw] lg:text-[180px] font-black tracking-tight leading-none text-center select-none bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] uppercase font-bricolage px-2"
            style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
          >
            Esperanza&apos;26
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={dividerVariants}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10 md:mb-16 origin-center"
        />

        {/* Content Details */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-8 text-center md:text-left">

          {/* Address Section */}
          <motion.div variants={itemVariants} className="flex-1 w-full md:w-auto space-y-4 md:space-y-6">
            <h3 className="text-white/40 text-xs md:text-sm font-poppins font-medium tracking-[0.2em] uppercase">Location</h3>
            <div
              className="text-base md:text-xl font-light leading-relaxed text-white/90 tracking-wide space-y-1 font-bricolage"
              style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
            >
              <p>VelTech Road,</p>
              <p>Poonamallee - Avadi High Rd,</p>
              <p>Chennai - 62,</p>
              <p>Tamil Nadu</p>
            </div>
          </motion.div>

          {/* Social Icons */}
          <motion.div variants={itemVariants} className="flex-1 w-full md:w-auto flex flex-col items-center space-y-4 md:space-y-6">
            <h3 className="text-white/40 text-xs md:text-sm font-poppins font-medium tracking-[0.2em] uppercase">Connect</h3>
            <div className="flex items-center gap-6 md:gap-8">
              {socialAssets.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="h-6 w-6 md:h-8 md:w-8 object-contain filter grayscale brightness-200 contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="flex-1 w-full md:w-auto space-y-4 md:space-y-6 md:text-right">
            <h3 className="text-white/40 text-xs md:text-sm font-poppins font-medium tracking-[0.2em] uppercase">Contact</h3>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <motion.a
                href="mailto:esperanza@veltechmultitech.org"
                className="text-base md:text-xl font-light text-white/80 hover:text-white transition-colors tracking-wide font-bricolage"
                whileHover={{ x: -2, color: "#fff" }}
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
              >
                esperanza@veltechmultitech.org
              </motion.a>
            </div>
          </motion.div>

        </div>

        {/* Footer Meta - Centered & Clean */}
        <motion.div
          variants={itemVariants}
          className="mt-12 md:mt-24 flex flex-col items-center gap-4 pt-6 border-t border-white/5 text-white/30 text-[10px] md:text-sm uppercase tracking-widest font-medium font-bricolage"
          style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
        >
          <p>&copy; Copyright 2026 Vistara

          </p>
        </motion.div>

        {/* Back to Top - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20"
        >
          <motion.button
            onClick={() => {
              if (onBackToTop) {
                onBackToTop();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            whileHover={{ y: -3, scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center p-4 md:p-5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white transition-all shadow-lg group"
            aria-label="Back to top"
          >
            <span className="text-xl md:text-2xl group-hover:-translate-y-1 transition-transform duration-300">↑</span>
          </motion.button>
        </motion.div>

      </motion.div>
    </footer>
  );
};

export default Footer;