"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const CHARS = "!@#$%^&*():{};|,.<>/?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DecryptLink = ({ href, text, onClick, index }: { href: string; text: string; onClick: () => void; index: number }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);

    // Scramble effect on mount (appearance)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        let iteration = 0;

        // Delay the start based on index
        const startDelay = setTimeout(() => {
            setIsScrambling(true);
            interval = setInterval(() => {
                setDisplayText(prev =>
                    text
                        .split("")
                        .map((letter, i) => {
                            if (i < iteration) {
                                return text[i];
                            }
                            return CHARS[Math.floor(Math.random() * CHARS.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                    setIsScrambling(false);
                }

                iteration += 1 / 3;
            }, 30);
        }, 100 + (index * 150)); // Staggered start

        return () => {
            clearInterval(interval);
            clearTimeout(startDelay);
        };
    }, [text, index]);

    return (
        <Link
            href={href}
            onClick={onClick}
            className="group relative flex items-center justify-center w-full py-4 border-b border-white/5 overflow-hidden"
        >
            <span
                className={`text-3xl sm:text-4xl font-black font-bricolage tracking-tighter uppercase text-center transition-all duration-300 ${isScrambling ? 'text-white/50 blur-[1px]' : 'bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] group-hover:scale-110'}`}
                style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
            >
                {displayText}
            </span>

            {/* Hover Background Glow */}
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </Link>
    );
};

interface MobileNavProps {
    onRegister?: () => void;
}

const MobileNav = ({ onRegister }: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'HOME', href: '/' },
        { name: 'EVENTS', href: '/events' },
        { name: 'GALLERY', href: '/gallery' },
        { name: 'TEAM', href: '/team' },
    ];

    const socialAssets = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/VibranceVIT/',
            icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/svgs/fb-colored_5fd5ff7a-13.svg'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/vibrancevitchennai/',
            icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/94edbd09-30bd-4628-aeb9-93e9fb6900f8-vitvibrance-com/assets/svgs/insta-colored_b7ce9091-14.svg'
        },

        {
            name: 'X',
            url: 'https://x.com/vibrancevit',
            icon: 'https://vitvibrance.com/_next/static/media/X.8c0fc61f.svg'
        }
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Nav Toggle Bar */}
            <div className={`fixed top-0 left-0 right-0 z-[100] p-4 flex justify-between items-center sm:hidden pointer-events-none transition-all duration-300 ${isOpen ? 'mix-blend-difference' : ''}`}>
                {/* Logo - click through permitted */}
                <Link href="/" className="pointer-events-auto">
                    <Image
                        src="/logo.svg"
                        alt="Esperanza Logo"
                        width={100}
                        height={40}
                        className="w-[100px] h-auto object-contain drop-shadow-lg"
                    />
                </Link>

                {/* Menu Button - click through permitted */}
                <button
                    onClick={toggleMenu}
                    className="pointer-events-auto relative group p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                    aria-label="Toggle menu"
                >
                    <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-1.5 overflow-hidden">
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </div>
                </button>
            </div>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[99] bg-black sm:hidden flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

                        {/* Content Container */}
                        <div className="relative flex flex-col h-full w-full max-w-sm mx-auto px-6 pt-32 pb-20 justify-center items-center">

                            {/* Navigation Links */}
                            <nav className="flex flex-col w-full items-center gap-2 mb-12">
                                {navLinks.map((link, index) => (
                                    <DecryptLink
                                        key={link.href}
                                        href={link.href}
                                        text={link.name}
                                        index={index}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ))}
                            </nav>

                            {/* Footer / CTA - Centered */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="flex flex-col gap-8 w-full items-center"
                            >
                                <div className="flex gap-4 w-full justify-center">
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            if (onRegister) onRegister();
                                        }}
                                        className="flex-1 py-4 bg-white text-black font-black font-bricolage uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors max-w-[160px]"
                                    >
                                        Register
                                    </button>
                                    <button className="flex-1 py-4 border-2 border-white/20 text-white font-black font-bricolage uppercase tracking-wider rounded-xl hover:bg-white/10 transition-colors max-w-[160px]">
                                        Login
                                    </button>
                                </div>

                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-bricolage">Event Date</span>
                                        <span className="text-lg font-bold font-bricolage bg-gradient-to-b from-white via-[#C0C0C0] to-[#505050] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">MARCH 6, 2026</span>
                                    </div>

                                    <div className="flex gap-8 mt-4">
                                        {socialAssets.map((social) => (
                                            <a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative block"
                                            >
                                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <img
                                                    src={social.icon}
                                                    alt={social.name}
                                                    className="h-6 w-6 object-contain filter grayscale brightness-200 contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500 hover:scale-110"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileNav;
