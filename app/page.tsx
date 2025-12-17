'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  NoiseTexture,
  BrutalistButton,
  BrutalistCard,
  BrutalistCardTitle,
  BrutalistCardDescription,
  MarqueeSection,
  MarqueeItem,
  MassiveNumber
} from '@/components/kinetic';
import { Video, Scissors, Upload } from 'lucide-react';
import { useRef } from 'react';

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax: zoom and fade out hero as user scrolls
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <NoiseTexture />

      {/* Hero Section with Viewport Typography */}
      <motion.section
        ref={heroRef}
        style={{ scale, opacity }}
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      >
        <div className="max-w-[95vw] text-center">
          {/* Massive viewport-responsive headline */}
          <h1 className="text-[clamp(3rem,12vw,14rem)] font-bold leading-[0.8] tracking-tighter uppercase mb-8">
            RECORD,
            <br />
            TRIM,
            <br />
            <span className="text-accent">SHARE</span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-tight mb-12">
            Professional screen recording studio in your browser.
            <br />
            NO DOWNLOADS. NO LIMITS. PURE CREATIVE POWER.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/record">
              <BrutalistButton size="lg">
                <Video className="w-5 h-5 mr-2 inline" />
                START RECORDING
              </BrutalistButton>
            </Link>
            <Link href="/trim">
              <BrutalistButton variant="outline" size="lg">
                <Scissors className="w-5 h-5 mr-2 inline" />
                TRIM VIDEO
              </BrutalistButton>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Stats Marquee - Fast Scroll, Acid Yellow Background */}
      <MarqueeSection speed={80} background="accent">
        <MarqueeItem>
          <MassiveNumber>100%</MassiveNumber>
          <span className="text-2xl uppercase tracking-wider">BROWSER-BASED</span>
        </MarqueeItem>
        <MarqueeItem>
          <span className="text-8xl">•</span>
        </MarqueeItem>
        <MarqueeItem>
          <MassiveNumber>∞</MassiveNumber>
          <span className="text-2xl uppercase tracking-wider">NO LIMITS</span>
        </MarqueeItem>
        <MarqueeItem>
          <span className="text-8xl">•</span>
        </MarqueeItem>
        <MarqueeItem>
          <MassiveNumber>0MS</MassiveNumber>
          <span className="text-2xl uppercase tracking-wider">LATENCY</span>
        </MarqueeItem>
        <MarqueeItem>
          <span className="text-8xl">•</span>
        </MarqueeItem>
      </MarqueeSection>

      {/* Features - Sticky Scroll Cards */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none mb-16 text-center">
            EVERYTHING
            <br />
            YOU NEED
          </h2>

          {/* Feature 1 - Screen Recording */}
          <div className="sticky top-32">
            <Link href="/record">
              <BrutalistCard enableHover>
                <div className="relative">
                  <MassiveNumber decorative className="right-0 top-0">
                    01
                  </MassiveNumber>
                  <div className="relative z-10">
                    <div className="mb-4">
                      <Video className="w-12 h-12 md:w-16 md:h-16 transition-colors duration-300 group-hover:text-accent-foreground" />
                    </div>
                    <BrutalistCardTitle className="mb-4">
                      SCREEN RECORDING
                    </BrutalistCardTitle>
                    <BrutalistCardDescription>
                      Capture your screen with crystal-clear audio. Perfect for tutorials and demos.
                      Record presentations, product tours, or creative processes.
                    </BrutalistCardDescription>
                  </div>
                </div>
              </BrutalistCard>
            </Link>
          </div>

          {/* Feature 2 - Video Trimming */}
          <div className="sticky top-32">
            <Link href="/trim">
              <BrutalistCard enableHover>
                <div className="relative">
                  <MassiveNumber decorative className="right-0 top-0">
                    02
                  </MassiveNumber>
                  <div className="relative z-10">
                    <div className="mb-4">
                      <Scissors className="w-12 h-12 md:w-16 md:h-16 transition-colors duration-300 group-hover:text-accent-foreground" />
                    </div>
                    <BrutalistCardTitle className="mb-4">
                      PRECISION TRIMMING
                    </BrutalistCardTitle>
                    <BrutalistCardDescription>
                      Frame-perfect editing with FFmpeg.wasm. Trim, crop, and export in WebM or MP4
                      — all in your browser.
                    </BrutalistCardDescription>
                  </div>
                </div>
              </BrutalistCard>
            </Link>
          </div>

          {/* Feature 3 - Share & Track */}
          <div className="sticky top-32">
            <Link href="/upload">
              <BrutalistCard enableHover>
                <div className="relative">
                  <MassiveNumber decorative className="right-0 top-0">
                    03
                  </MassiveNumber>
                  <div className="relative z-10">
                    <div className="mb-4">
                      <Upload className="w-12 h-12 md:w-16 md:h-16 transition-colors duration-300 group-hover:text-accent-foreground" />
                    </div>
                    <BrutalistCardTitle className="mb-4">
                      UPLOAD & TRACK
                    </BrutalistCardTitle>
                    <BrutalistCardDescription>
                      Upload and get instant shareable links. Track views and engagement with
                      built-in analytics.
                    </BrutalistCardDescription>
                  </div>
                </div>
              </BrutalistCard>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Grid */}
      <section className="py-32 px-4 border-t-2 border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none mb-20 text-center">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-border">
            {[
              { num: "01", title: "RECORD", desc: "Capture screen + audio in seconds" },
              { num: "02", title: "TRIM", desc: "Frame-perfect precision cutting" },
              { num: "03", title: "SHARE", desc: "Track every view, every second" }
            ].map((step) => (
              <div key={step.num} className="bg-background p-12">
                <div className="text-[8rem] font-bold leading-none text-muted mb-4">
                  {step.num}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee - Slower Scroll */}
      <MarqueeSection speed={40}>
        <MarqueeItem>
          <div className="border-2 border-border p-8 w-[400px]">
            <p className="text-xl mb-4">"FINALLY A SCREEN RECORDER THAT DOESN'T SUCK."</p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">— Sarah K.</p>
          </div>
        </MarqueeItem>
        <MarqueeItem>
          <div className="border-2 border-border p-8 w-[400px]">
            <p className="text-xl mb-4">"TRIMMING IN THE BROWSER? GAME CHANGER."</p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">— Alex M.</p>
          </div>
        </MarqueeItem>
        <MarqueeItem>
          <div className="border-2 border-border p-8 w-[400px]">
            <p className="text-xl mb-4">"ANALYTICS TRACKING IS BRILLIANT."</p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">— Jordan L.</p>
          </div>
        </MarqueeItem>
      </MarqueeSection>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="border-2 border-border p-16 relative overflow-hidden">
            <MassiveNumber decorative className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
              ∞
            </MassiveNumber>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-none mb-6">
                READY TO
                <br />
                CREATE?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Join thousands using MarvelEdge for professional screen recording
              </p>
              <Link href="/record">
                <BrutalistButton size="lg">
                  GET STARTED FREE
                </BrutalistButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Acid Yellow Background */}
      <footer className="bg-accent text-accent-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">MARVELEDGE</h3>
              <p className="text-sm uppercase tracking-wider">SCREEN RECORDING STUDIO</p>
            </div>
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-4">FEATURES</h4>
              <ul className="space-y-2 text-sm uppercase tracking-wider">
                <li><Link href="/record" className="hover:underline">RECORD</Link></li>
                <li><Link href="/trim" className="hover:underline">TRIM</Link></li>
                <li><Link href="/upload" className="hover:underline">UPLOAD</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-4">TECH</h4>
              <ul className="space-y-2 text-sm uppercase tracking-wider">
                <li>NEXT.JS 15</li>
                <li>FFMPEG.WASM</li>
                <li>TYPESCRIPT</li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-accent-foreground/20 pt-8 text-center">
            <p className="text-sm uppercase tracking-wider">
              © 2025 MARVELEDGE. KINETIC TYPOGRAPHY DESIGN.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
