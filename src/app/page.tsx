"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/sections/header";
import MobileNav from "@/components/sections/MobileNav";
import HeroSection from "@/components/sections/hero";
import IntroTextSection from "@/components/sections/intro-text";
import JuryReveal from "@/components/sections/jury-reveal";
import TeaserVideo from "@/components/sections/teaser-video";
import Vistara from "@/components/sections/vistara";
import Sponsors from "@/components/sections/sponsors";
import Inauguration from "@/components/sections/inauguration";
import Valedictory from "@/components/sections/valedictory";
import Footer from "@/components/sections/footer";
import Loader from "@/components/ui/loader";
import { TicketPortal } from "@/components/admin/TicketPortal";
import config from "@/config";
import { Content } from "@/types/admin";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTicketPortal, setShowTicketPortal] = useState(false);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    // Fetch content (prices, upi, etc.)
    const fetchContent = async () => {
      try {
        const res = await fetch(`${config.API_URL}/content`);
        const data = await res.json();
        if (data.success) {
          setContent(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch content", error);
      }
    };
    fetchContent();
  }, []);

  const router = useRouter();

  const handleRegisterClick = () => {
    if (content?.isTicketPassEnabled === false) {
      router.push('/events');
    } else {
      setShowTicketPortal(true);
    }
  };

  return (
    <>
      <Loader onLoadingComplete={() => setIsLoading(false)} />
      <main
        className="relative min-h-screen bg-background text-foreground"
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
      >
        <div className="grainy-overlay" />
        <MobileNav onRegister={handleRegisterClick} />
        <Header onRegister={handleRegisterClick} />
        <HeroSection />
        <IntroTextSection />
        <JuryReveal />
        <TeaserVideo />
        <Vistara />
        <Sponsors />
        <Footer />

        {showTicketPortal && content && (
          <TicketPortal
            prices={content.ticketPrices}
            upiId={content.upiId}
            qrCodeUrl={content.qrCodeUrl}
            onClose={() => setShowTicketPortal(false)}
          />
        )}
      </main>
    </>
  );
}