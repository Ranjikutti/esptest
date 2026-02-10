"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useMenu } from "@/context/MenuContext";

const HeroSection: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [nextVideoIndex, setNextVideoIndex] = useState(1);
    const [isHovering, setIsHovering] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { isMenuOpen, toggleMenu } = useMenu();

    const currentVideoRef = useRef<HTMLVideoElement>(null);
    const nextVideoRef = useRef<HTMLVideoElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);

    const centerBoxRef = useRef<HTMLDivElement>(null);
    const transitionOverlayRef = useRef<HTMLDivElement>(null);
    const perspectiveWrapperRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const dateThisRef = useRef<HTMLParagraphElement>(null);
    const dateMarchRef = useRef<HTMLHeadingElement>(null);
    const dateMarchBgRef = useRef<HTMLDivElement>(null);
    const dateNumbersRef = useRef<HTMLDivElement>(null);

    const videos = [
        "/intro%20videos/intro1.mp4",
        "/intro%20videos/intro2.mp4",
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setNextVideoIndex((currentVideoIndex + 1) % videos.length);
    }, [currentVideoIndex, videos.length]);

    useEffect(() => {
        if (currentVideoRef.current) {
            currentVideoRef.current.load();
            currentVideoRef.current.play().catch((error) => {
                console.log("Current video autoplay prevented:", error);
            });
        }
    }, [currentVideoIndex]);

    useEffect(() => {
        if (nextVideoRef.current) {
            nextVideoRef.current.load();
        }
    }, [nextVideoIndex]);

    useEffect(() => {
        if (isHovering && previewVideoRef.current && !isTransitioning) {
            previewVideoRef.current.play().catch((error) => {
                console.log("Preview video play prevented:", error);
            });
        } else if (previewVideoRef.current) {
            previewVideoRef.current.pause();
            previewVideoRef.current.currentTime = 0;
        }
    }, [isHovering, isTransitioning]);

    useEffect(() => {
        if (!isMounted) return;

        const tl = gsap.timeline({ delay: 0.2 });

        // Safely check if elements exist before animating
        const elementsToAnimate = [
            dateMarchRef.current,
            dateMarchBgRef.current
        ].filter(el => el !== null);

        if (elementsToAnimate.length === 0) return;

        tl.set(elementsToAnimate, {
            opacity: 0,
        });

        if (dateMarchRef.current) {
            tl.set(dateMarchRef.current, {
                color: "#9C18FF",
                fontStyle: "normal",
            });
        }

        if (dateMarchBgRef.current) {
            tl.set(dateMarchBgRef.current, {
                scaleX: 0.3,
                transformOrigin: "left center",
            });
        }

        if (dateMarchBgRef.current) {
            tl.to(dateMarchBgRef.current, {
                opacity: 1,
                duration: 0.15,
                ease: "power2.out",
            }, "+=0.8");
        }

        if (dateMarchBgRef.current) {
            tl.to(dateMarchBgRef.current, {
                scaleX: 1,
                duration: 0.3,
                ease: "power2.out",
            }, "+=0.2");
        }

        if (dateMarchRef.current) {
            tl.to(dateMarchRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out",
            }, "+=0.2");
        }

        if (dateMarchBgRef.current) {
            tl.to(dateMarchBgRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
            }, "+=0.1");
        }

        if (dateMarchRef.current) {
            tl.to(dateMarchRef.current, {
                color: "#ffffff",
                duration: 0.25,
                ease: "power2.inOut",
            }, "+=0.3");
        }

        // Add looping animation after initial animation
        tl.call(() => {
            // Loop animation for the date text
            if (dateMarchRef.current) {
                gsap.fromTo(dateMarchRef.current,
                    { color: "#ffffff", scale: 1 },
                    {
                        scale: 1.05,
                        color: "#A855F7",
                        duration: 1.5,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                    }
                );
            }
        });

        return () => {
            tl.kill();
        };
    }, [isMounted]);

    const MAX_ROT_X = 8;
    const MAX_ROT_Y = 8;
    const LIFT_SCALE = 1.06;
    const LIFT_Z = 12;
    const ENTER_DUR = 0.25;
    const MOVE_DUR = 0.25;
    const LEAVE_DUR = 0.55;

    const leaveTweenRef = useRef<gsap.core.Tween | null>(null);

    const handleHoverMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isTransitioning) return;
        setIsHovering(true);

        requestAnimationFrame(() => {
            if (!cardRef.current) return;

            if (leaveTweenRef.current) {
                leaveTweenRef.current.kill();
                leaveTweenRef.current = null;
            }

            gsap.to(cardRef.current, {
                scale: LIFT_SCALE,
                z: LIFT_Z,
                duration: ENTER_DUR,
                ease: "power2.out",
                overwrite: "auto",
            });
        });
    }, [isTransitioning]);

    const handleHoverMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isTransitioning) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;

        const targetRotY = (nx - 0.5) * 2 * MAX_ROT_Y;
        const targetRotX = (0.5 - ny) * 2 * MAX_ROT_X;

        gsap.to(cardRef.current, {
            rotationX: targetRotX,
            rotationY: targetRotY,
            duration: MOVE_DUR,
            ease: "power2.out",
            overwrite: "auto",
        });
    }, [isTransitioning]);

    const handleHoverMouseLeave = useCallback(() => {
        setIsHovering(false);

        if (!cardRef.current) return;

        leaveTweenRef.current = gsap.to(cardRef.current, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            z: 0,
            duration: LEAVE_DUR,
            ease: "power4.out",
        });
    }, []);

    const handleClick = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setIsHovering(false);

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
                setIsTransitioning(false);
            }
        });

        tl.to(centerBoxRef.current, {
            scale: 3,
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
        })
            .to(transitionOverlayRef.current, {
                opacity: 1,
                duration: 0.4,
            }, "-=0.3")
            .to(currentVideoRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            }, "-=0.2")
            .call(() => {
                if (nextVideoRef.current) {
                    nextVideoRef.current.play().catch(console.log);
                }
            })
            .to(nextVideoRef.current, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            })
            .to(transitionOverlayRef.current, {
                opacity: 0,
                duration: 0.3,
            }, "-=0.2")
            .set(centerBoxRef.current, {
                scale: 1,
                opacity: 1,
            });
    };

    return (
        <section className="relative h-dvh w-full overflow-hidden select-none bg-black">
            {/* Animated Gradient + Noise Background for Mobile */}
            <div className="absolute inset-0 sm:hidden z-0 overflow-hidden bg-black">
                {/* Purple Gradient Blobs */}
                <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob"></div>
                <div className="absolute top-[20%] right-[-20%] w-[70vw] h-[70vw] bg-violet-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>

                {/* Noise Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "100px 100px",
                    }}
                ></div>

                {/* Dark Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div id="video-frame" className="relative z-10 h-dvh w-full overflow-hidden">
                <div className="relative h-full w-full">
                    {/* Background Videos - Hidden on Mobile */}
                    <video
                        ref={currentVideoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="hidden sm:block absolute left-0 top-0 h-full w-full object-cover object-center"
                        key={`current-${currentVideoIndex}`}
                    >
                        <source src={videos[currentVideoIndex]} type="video/mp4" />
                    </video>

                    <video
                        ref={nextVideoRef}
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="hidden sm:block absolute left-0 top-0 h-full w-full object-cover object-center opacity-0 pointer-events-none"
                        key={`next-${nextVideoIndex}`}
                    >
                        <source src={videos[nextVideoIndex]} type="video/mp4" />
                    </video>

                    {/* Mobile Layout - Text Above and Below Center Video */}
                    <div className="sm:hidden absolute inset-0 z-30 flex flex-col items-center justify-center gap-0 px-4 pointer-events-none">
                        {/* ESPERANZA Text Above Video */}
                        <h1
                            className="font-black uppercase text-[4rem] leading-[0.85] tracking-tighter text-center bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent -mb-1 relative z-0"
                            style={{
                                fontFamily: "var(--font-bricolage)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            ESPERANZA
                        </h1>

                        {/* Center Video with Rotation */}
                        <div
                            className="relative w-[300px] h-[160px] pointer-events-none z-10"
                            style={{
                                transform: "perspective(800px) rotateY(-8deg) rotateX(3deg) rotateZ(5deg)",
                                transformOrigin: "center center"
                            }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-full object-cover rounded-sm shadow-2xl"
                                style={{
                                    boxShadow: "0 25px 50px rgba(0,0,0,0.9)"
                                }}
                            >
                                <source src={videos[currentVideoIndex]} type="video/mp4" />
                            </video>
                        </div>

                        {/* 2K26 Text Below Video */}
                        <h2
                            className="font-black text-[7rem] leading-[0.8] tracking-tighter text-center bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent -mt-12 relative z-20"
                            style={{
                                fontFamily: "var(--font-bricolage)",
                                letterSpacing: "-0.05em",
                            }}
                        >
                            2K26
                        </h2>
                    </div>

                    {/* Mobile - Date Section Bottom Left */}
                    <div className="sm:hidden absolute bottom-10 left-6 z-40 pointer-events-none">
                        <p className="text-white text-xl font-medium leading-none" style={{ fontFamily: "var(--font-bricolage)" }}>
                            This
                        </p>
                        <h3 className="text-4xl font-black leading-none bg-gradient-to-b from-white via-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]" style={{ fontFamily: "var(--font-bricolage)" }}>
                            6TH MARCH
                        </h3>
                    </div>

                    {/* Mobile - CTA Buttons Bottom Right */}
                    <div className="sm:hidden absolute bottom-24 right-4 z-40 flex flex-col gap-3 pointer-events-auto">
                        <Link href="/events" className="w-full">
                            <button className="group relative w-full overflow-hidden rounded-full border-2 border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#3B1344,55%,#000103)] bg-[length:200%_100%] px-6 py-3 font-black text-white transition-all duration-300 animate-shimmer focus:outline-none"
                                style={{
                                    fontFamily: "var(--font-bricolage)",
                                    letterSpacing: '-0.05em',
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                                    EXPLORE EVENTS
                                </span>
                                {/* Glow effect on hover */}
                                <div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                                />
                            </button>
                        </Link>
                    </div>




                    {/* Mobile - #VISTARA Bottom Right */}
                    <h1
                        className="sm:hidden absolute bottom-6 right-4 z-40 font-extrabold select-none text-xs font-bricolage bg-gradient-to-b from-white via-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        style={{
                            fontFamily: "var(--font-bricolage)",
                            letterSpacing: "0.1em",
                            lineHeight: "0.8"
                        }}
                    >
                        #<b>V</b>ISTARA
                    </h1>

                    {/* Desktop - #VISTARA Bottom Right */}
                    <h1
                        className="hidden sm:block absolute bottom-6 right-4 sm:bottom-8 sm:right-5 z-40 font-extrabold select-none text-sm sm:text-base md:text-lg font-bricolage bg-gradient-to-b from-white via-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent mix-blend-screen drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        style={{
                            fontFamily: "var(--font-bricolage)",
                            letterSpacing: "-0.05em",
                            lineHeight: "0.8"
                        }}
                    >
                        #<b>V</b>ISTARA
                    </h1>

                    {/* Desktop - Interactive Center Video */}
                    <div
                        ref={perspectiveWrapperRef}
                        className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 size-48 sm:size-72 cursor-pointer"
                        style={{ perspective: "800px" }}
                        onMouseEnter={handleHoverMouseEnter}
                        onMouseMove={handleHoverMouseMove}
                        onMouseLeave={handleHoverMouseLeave}
                        onClick={handleClick}
                    >
                        <div
                            ref={cardRef}
                            className="relative size-full"
                            style={{
                                transformStyle: "preserve-3d",
                                transform: "rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)",
                            }}
                        >
                            {isHovering && !isTransitioning && (
                                <div
                                    ref={centerBoxRef}
                                    className="relative size-full overflow-hidden rounded-lg shadow-2xl"
                                >
                                    <video
                                        ref={previewVideoRef}
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                        className="size-full object-cover object-center rounded-lg"
                                    >
                                        <source src={videos[nextVideoIndex]} type="video/mp4" />
                                    </video>

                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                                            Click to Switch
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        ref={transitionOverlayRef}
                        className="absolute inset-0 z-40 bg-black/50 opacity-0 pointer-events-none"
                    />
                </div>
            </div>

            {/* Desktop - Date Section (Bottom Left) */}
            <div className="hidden sm:block absolute z-20 bottom-[140px] sm:bottom-[120px] md:bottom-[40px] left-[20px] sm:left-[25px] md:left-[50px]">
                <div className="flex flex-col w-fit h-fit relative">


                    <div className="relative">
                        <div
                            ref={dateMarchBgRef}
                            className="absolute top-[0.4rem] sm:top-[0.6rem] -left-[5%] bg-foreground w-[110%] h-[2.6rem] sm:h-[4rem] -z-10"
                        ></div>

                        <h2
                            ref={dateMarchRef}
                            className="font-extrabold text-[3rem] sm:text-[4.5rem] leading-[0.8] tracking-tighter"
                            style={{ fontFamily: "var(--font-bricolage)", fontWeight: 800, fontStyle: "normal" }}
                        >
                            6TH MARCH
                        </h2>
                    </div>

                    <div
                        ref={dateNumbersRef}
                        className="mt-1 text-[1.4rem] sm:text-[1.8rem] font-medium"
                        style={{ fontFamily: "'Impact', 'Anton', sans-serif" }}
                    >
                    </div>
                </div>
            </div>

            {/* Desktop - VTMT VG Logo (Top Left) */}
            <div className="hidden sm:block absolute z-50 top-0 left-0 sm:top-1 sm:left-1">
                <Image
                    src="/vtmt.svg"
                    alt="VTMT VG Logo"
                    width={320}
                    height={100}
                    className="w-24 h-24 sm:w-[320px] sm:h-[100px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Desktop - VSC Logo (Top Right) */}
            <div className="hidden sm:block absolute z-50 top-5 right-5 sm:top-1 sm:right-1">
                <Image
                    src="/VSC.svg"
                    alt="VSC Logo"
                    width={250}
                    height={100}
                    className="w-20 h-20 sm:w-[250px] sm:h-[100px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Desktop - Action Buttons (Bottom Right) */}
            <div className="hidden sm:flex absolute z-30 items-end sm:items-center justify-end sm:justify-center bottom-[140px] sm:bottom-28 md:bottom-12 right-4 sm:right-0 sm:w-full sm:px-6">
                <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
                    <Link href="/events" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-slate-400 bg-[linear-gradient(110deg,#000103,45%,#3B1344,55%,#000103)] bg-[length:200%_100%] px-6 sm:px-8 py-3 sm:py-3.5 font-black text-white transition-all duration-300 animate-shimmer focus:outline-none"
                        style={{
                            fontFamily: "var(--font-bricolage)",
                            letterSpacing: '-0.05em',
                        }}>
                        <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                            Explore Events
                        </span>
                        {/* Glow effect on hover */}
                        <div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                        />
                    </Link>


                </div>
            </div>







            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-background z-[1]"></div>
        </section >
    );
};

export default HeroSection;
