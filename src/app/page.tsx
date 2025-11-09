"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useInView } from "react-intersection-observer";
import { Heart, MapPin, Calendar, Mail, CheckCircle, Menu, X, Clock, Gift, Camera, Compass } from 'lucide-react';
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";



// --- CONFIGURATION ---
const COUPLE_INFO = {
  // UPDATED: Full names used for formal sections, shortened names used for hero/visuals
  bride: "DEANNE", 
  groom: "ULYSSES", 
  date: "January 10, 2026", 
  time: "2:30 PM", 
  venue: "Maria Paz Royale Garden", 
  address: "Brgy. Sta Filomena, San Pablo City", 
  rsvpDeadline: "December 10, 2025",
  dressCode: "Formal Attire (Black tie optional)",
  weddingDate: new Date("January 10, 2026 14:30:00").getTime(), 
  
  // NEW: Parent Info
  parentsGroom: {
    father: "MR. RONALITO LLAMOSO",
    mother: "MRS. MARIA JO ANN LLAMOSO",
  },
  parentsBride: {
    father: "MR. DENNIS BALAALDIA",
    mother: "MRS. RACHEL BALAALDIA",
  },
};

const ENTOURAGE_DATA = {
    principalSponsors: {
        male: [
            "MR. FERDIE BADULIS", "MR. CARLOS CASTRO", "MR. RODERICK DE GUZMAN",
            "MR. DARRYL GARCIA", "MR. JEREMY ROSALES", "MR. EUGENE BALAALDIA",
            "MR. ERWIN ABE", "MR. EMMANUEL NAGASAN", "MR. OMAR DELA PAZ",
            "MR. ARIEL JALANDOON", "MR. THEODORE BALLESTERO", "MR. RESTITUTO LARGOSA",
            "MR. BENJAMIN GERVACIO", "MR. ALEX FLAVIER", "MR. ANTHONY TABLICO",
            "MR. TOPHER LLAMOSO", "MR. MAX GERARD OPEÑA",
        ],
        female: [
            "MRS. MARIA JOSEL VERGARA", "MRS. MARIAN CASTRO", "MRS. LIZBETH DE GUZMAN",
            "MRS. RACHELLE GARCIA", "MRS. SHERYLL ROSALES", "MRS. MELANIE BALAALDIA",
            "MRS. REAN ABE", "MRS. NERI NAGASAN", "MRS. ROSETTE DELA PAZ",
            "MRS. SONIA JALANDOON", "MRS. EUSEBIA CHANGCOCO", "MRS. EVANGELINE BALLESTERO",
            "MRS. OFELIA PANTALEON", "MRS. ROSALINDA GARCIA", "MRS. LORIELIE DAGLE",
            "MRS. JULIET ESCOBAR", "MRS. ARMINA OPEÑA",
        ]
    },
    // Best Man and Maids of Honor/Matron of Honor are separated for clean layout
    bestMan: ["RHON VINCENT LLAMOSO", "JOHN DANIEL LLAMOSO"],
    maidsOfHonor: ["ANGELA JOYCE ABE", "CHAIZY SALONGA"],
    matronOfHonor: ["PRINCESS ELAINE ASTILLA"],
    secondarySponsors: [
        { role: "Candle", couple: [ "DIANA KEITH LLAMOSO", "RADENN IAN BALAALDIA" ] },
        { role: "Veil", couple: [ "ROSELYN RANA", "IVER DE GUZMAN" ] },
        { role: "Cord", couple: [ "FAITH YVONNE BAÑAGALE", "KYLE BALAALDIA" ] },
    ]
};
// Color Palette
const COLORS = {
  mountainPink: '#906272',
  silverPink: '#C4AEB2',
  almond: '#EAD6C6',
  taupeGray: '#878784',
  oldLavender: '#796A7E',
  
};

const NAV_LINKS = [
  { name: 'Home', page: 'home', section: '#home' },
  { name: 'Prenup', page: 'details', section: '#prenup' },
  { name: 'Location', page: 'details', section: '#location' },
  { name: 'Entourage', page: 'details', section: '#entourage' },
  { name: 'Dresscode', page: 'details', section: '#dresscode' },
  { name: 'RSVP', page: 'home', section: '#rsvp' },
];

const ROTATING_QUOTES = [
  "A forever kind of love.",
  "Two souls, one incredible journey.",
  "The beginning of our forever.",
  "Love, Laughter, and Happily Ever After.",
  "Our perfect day starts now.",
];

// --- TYPES ---
interface RsvpFormData {
  name: string;
  attending: 'yes' | 'no' | null;
  guests: number;
  dietaryRestrictions: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type PageType = 'home' | 'details' | 'rsvp' | 'gallery';

// --- HOOKS ---
const useSparkleEffect = () => {
  useEffect(() => {
    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-effect'; 
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      const size = Math.random() * 5 + 5;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.opacity = '1';
      sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(sparkle);
      setTimeout(() => {
        sparkle.style.opacity = '0';
        sparkle.style.transform = `translateY(-${Math.random() * 30}px) rotate(${Math.random() * 360}deg)`;
        sparkle.style.transition = 'all 1s ease-out';
        setTimeout(() => sparkle.remove(), 1000);
      }, 10);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.7) createSparkle(e.clientX, e.clientY + window.scrollY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
};

const useCountdown = (targetDate: number): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = targetDate - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// --- COMPONENTS ---

const TextCarousel: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % ROTATING_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 hidden lg:block w-full max-w-sm xl:max-w-lg z-10 text-left px-12">
      <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-white italic tracking-wider leading-snug drop-shadow-lg transition-opacity duration-1000 ease-in-out">
        <span key={currentQuoteIndex} className="animate-fade-in">{ROTATING_QUOTES[currentQuoteIndex]}</span>
      </h2>
    </div>
  );
};

// --- NavBar with expanded PageType ---
const NavBar: React.FC<{
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}> = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Fixed smooth scroll logic with slight delay and navbar offset
  const handleNavClick = useCallback(
    (page: PageType, section: string) => {
      setCurrentPage(page);
      setIsOpen(false);

      // Wait a short moment for React re-render (important for smooth single-click behavior)
      setTimeout(() => {
        const el = document.querySelector(section) as HTMLElement;
        if (el) {
          const yOffset = -80; // offset for fixed navbar height
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100); // 100ms delay fixes double-click issue
    },
    [setCurrentPage]
  );

  // Handle navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        backgroundColor: scrolled
          ? "rgba(121,106,126,0.85)"
          : COLORS.oldLavender,
        backdropFilter: scrolled ? "blur(6px)" : undefined,
        transition: "background-color 0.3s",
      }}
      className="fixed top-0 left-0 w-full z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={() => handleNavClick("home", "#home")}
            style={{ color: COLORS.almond }}
            className="text-xl sm:text-2xl font-serif font-bold tracking-widest"
          >
            {COUPLE_INFO.bride} & {COUPLE_INFO.groom}
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() =>
                  handleNavClick(link.page as PageType, link.section)
                }
                style={{
                  color: COLORS.almond,
                  fontWeight:
                    currentPage === link.page ? "bold" : "normal",
                  position: "relative",
                }}
                className="text-sm font-serif transition duration-200 uppercase tracking-widest relative px-1 py-2"
              >
                {link.name}
                {currentPage === link.page && (
                  <span
                    style={{ backgroundColor: COLORS.mountainPink }}
                    className="absolute bottom-0 left-0 w-full h-0.5"
                  ></span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-full transition duration-150"
            style={{ color: COLORS.almond }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          style={{ backgroundColor: COLORS.taupeGray }}
          className="lg:hidden pb-4 transition-all duration-300 ease-in-out"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() =>
                handleNavClick(link.page as PageType, link.section)
              }
              style={{
                color: COLORS.almond,
                borderTop: `1px solid ${COLORS.almond}33`, // 20% opacity
              }}
              className="block w-full text-left px-4 py-3 text-base uppercase tracking-wider font-medium hover:bg-[#906272] hover:text-white"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

/**
 * The main cover section (Hero).
 */
const CoverSection: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <header
      id="home"
      className="relative h-screen flex flex-col items-center justify-center text-white overflow-hidden pt-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/hero.jpeg")',
          filter: "brightness(0.5)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        ></div>
      </div>

      {/* Text Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="z-10"
      >
        <TextCarousel />
      </motion.div>

      {/* Content Box */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center p-6 sm:p-8 md:p-12 rounded-xl max-w-xl mx-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          border: `2px solid ${COLORS.mountainPink}`,
        }}
      >
        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-lg md:text-xl font-serif italic mb-4 tracking-widest"
          style={{ color: COLORS.almond }}
        >
          The wedding celebration of
        </motion.p>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-wrap justify-center items-center font-serif font-bold mb-4 leading-tight"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            {COUPLE_INFO.bride}
          </span>
          <span
            className="mx-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            style={{ color: COLORS.mountainPink }}
          >
            &amp;
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            {COUPLE_INFO.groom}
          </span>
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="text-xl sm:text-2xl md:text-3xl font-serif border-y py-3 mt-6"
          style={{
            borderColor: "rgba(255,255,255,0.5)",
            color: COLORS.almond,
          }}
        >
          {COUPLE_INFO.date}
        </motion.p>

        {/* Venue */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-lg sm:text-xl mt-4 font-light tracking-wider"
          style={{ color: COLORS.almond }}
        >
          {COUPLE_INFO.venue}
        </motion.p>

        {/* RSVP Button */}
        <motion.a
          href="#rsvp"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
          style={{
            borderColor: COLORS.mountainPink,
            color: COLORS.almond,
          }}
          className="mt-8 inline-flex items-center px-8 py-3 uppercase tracking-widest hover:bg-[#906272] transition duration-300 rounded-full text-sm sm:text-base font-semibold shadow-lg"
        >
          RSVP Now{" "}
          <Heart
            className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: COLORS.almond }}
          />
        </motion.a>

        {/* Music Player Toggle */}
        <button
          onClick={toggleMusic}
          className="mt-6 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.4)] transition duration-300"
        >
          {isPlaying ? "Pause Music" : "Play Music"}
        </button>

        {/* Hidden Audio */}
        <audio ref={audioRef} loop src="audio1.mp3" />
      </motion.div>
    </header>
  );
};




/**
 * NEW SECTION: Invitation Text (Inserted after CoverSection)
 */
const InviteSection: React.FC = () => {
  // Correct useInView
  const [ref, isInView] = useInView({
    triggerOnce: true, // animate only once
    rootMargin: "-100px", // offset
  });

  const bgImageUrl = "images/invitebg.jpg";
  const decorationUrl = "images/invitering.png";

  return (
    <section
      id="invite"
      className="py-24 md:py-32 relative flex justify-center items-center"
      style={{
        background: "linear-gradient(135deg, #796878 0%, #A798AB 100%)",
      }}
    >
      {/* Floating Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-6 md:mx-0 p-10 md:p-16 rounded-3xl shadow-2xl text-center"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#1f2937",
        }}
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-4xl md:text-5xl mb-6 md:mb-10"
          style={{ color: "#A0522D" }}
        >
          We Invite You
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl italic leading-relaxed font-light max-w-3xl mx-auto"
          style={{ color: "#826770" }}
        >
          Our paths crossed by chance, but our hearts chose each other with purpose.
          Now, we're ready to celebrate a love that's grown deep and true.
          Please join us on January 10, 2026 as we begin our next chapter, surrounded by the warmth of your presence.
        </motion.p>

        {/* Couple Names */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 text-lg md:text-xl font-serif font-semibold"
          style={{ color: "#D88CA1" }}
        >
          Deanne & Ulysses
          <br />
          <span
            className="text-sm uppercase tracking-wider"
            style={{ color: "#6B7280" }}
          >
            The Beginning of Forever
          </span>
        </motion.p>

        {/* Decoration Image */}
        <motion.img
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
          src={decorationUrl}
          alt="Decoration"
          className="absolute -bottom-10 -right-5 xl:-bottom-25 xl:-right-25 md:-bottom-25 md:-right-1 w-[100px] md:w-[200px] sm:w-[100px] pointer-events-none bounce"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/150x150/FFD1DC/6d28d9?text=Deco";
            e.currentTarget.onerror = null;
          }}
        />
      </motion.div>

      {/* Optional Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.05))",
          zIndex: 0,
        }}
      />

      {/* Bouncing animation CSS */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .bounce {
            animation: bounce 2s infinite ease-in-out;
          }
        `}
      </style>
    </section>
  );
};



/**
 * Component to simulate stacked photo album pages.
 */
const BookOfMemories: React.FC = () => {
  const pages = [
    { key: 1, image: 'images/ourstory5.jpeg' },
    { key: 2, image: 'images/ourstory2.jpeg' },
    { key: 3, image: 'images/ourstory3.jpeg' },
    { key: 4, image: 'images/ourstory4.jpeg' },
    { key: 5, image: 'images/ourstory1.jpeg' },
  ];

  const [topIndex, setTopIndex] = useState(pages.length - 1);

  const handleClick = () => {
    setTopIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const baseStyle =
    "absolute w-full h-full bg-cover bg-center rounded-lg shadow-xl border border-stone-200 transform transition duration-500 ease-in-out cursor-pointer";

  // Only keep 3 cards in DOM for performance
  const getVisiblePages = () => {
    const visible: typeof pages = [];
    for (let i = 0; i < 3; i++) {
      const idx = (topIndex - i + pages.length) % pages.length;
      visible.push(pages[idx]);
    }
    return visible.reverse(); // Top page renders last
  };

  const rotations = ['-rotate-3', 'rotate-1', '-rotate-1'];
  const translates = ['-translate-x-3', 'translate-x-2', '-translate-x-1'];

  return (
    <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md h-[400px] perspective-1000 mx-auto">
      {getVisiblePages().map((page, idx) => (
        <div
          key={page.key}
          className={`${baseStyle} ${rotations[idx]} ${translates[idx]}`}
          style={{
            backgroundImage: `url(${page.image})`,
            zIndex: idx + 1,
            top: `${idx * 5}px`,
            left: 0,
          }}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

/**
 * Section for the couple's story (Story).
 */
const PreludeSection: React.FC = () => (
  <section
    id="story"
    className="py-20"
    style={{ backgroundColor: COLORS.almond, color: '#1f2937' }} // base text color
  >
    <div className="container mx-auto px-6 max-w-6xl">
      {/* Headline: Old Lavender */}
      <h2
        className="text-4xl font-serif text-center mb-12 border-b-2 pb-2 inline-block"
        style={{
          color: COLORS.oldLavender,
          borderColor: `${COLORS.mountainPink}80`, // 50% opacity
        }}
      >
        Our Story
      </h2>

      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COLUMN: Book/Image Fanning Effect (Col Span 5) */}
        <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
          <BookOfMemories />
        </div>

        {/* RIGHT COLUMN: Story Text (Col Span 7) */}
        <div className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2">
  <p className="text-lg leading-relaxed mb-6" style={{ color: COLORS.taupeGray }}>
    <Typewriter
      words={[
        "Before we knew it, those messages became memories, and those memories became love. On May 31, 2025, Ulysses proposed at the perfect moment, with both of our families present. And with a heart full of joy, I said YES."
      ]}
      loop={1}
      cursor
      cursorStyle="|"
      typeSpeed={30}
      deleteSpeed={0}
      delaySpeed={1000}
    />
  </p>

  <p className="text-lg leading-relaxed mb-8" style={{ color: COLORS.taupeGray }}>
    <Typewriter
      words={[
        "After eight years of building our life together—six of which we've shared a home, dreams, and the beautiful chaos of parenthood with our little four-year-old—we've come to a moment that feels both natural and extraordinary. Every sleepless night, every laughter-filled morning, every small victory and setback has woven us closer, shaping a family that is ours alone. So here we are, ready to take the next step—not just as partners, not just as parents, but as lifelong companions—asking each other, with full hearts, to make this commitment official: to promise, forever, the love and life we've already so beautifully shared."
      ]}
      loop={1}
      cursor
      cursorStyle="|"
      typeSpeed={30}
      deleteSpeed={0}
      delaySpeed={1000}
    />
  </p>

  <p className="text-xl font-serif italic" style={{ color: COLORS.oldLavender }}>
    <Typewriter
      words={["\"Every great love story is beautiful, but ours is my favorite.\""]}
      loop={1}
      cursor
      cursorStyle="|"
      typeSpeed={40}
      deleteSpeed={0}
      delaySpeed={1000}
    />
  </p>
</div>
      </div>
    </div>
  </section>
);

/**
 * Section for the Countdown Timer (Countdown).
 */
const CountdownSection: React.FC = () => {
  const timeLeft = useCountdown(COUPLE_INFO.weddingDate);
  const isPast = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const TimeBlock: React.FC<{ value: number, label: string }> = ({ value, label }) => (
      <div className="text-center p-4">
          {/* Old Lavender digits */}
          <div
              className="text-5xl font-sans font-extrabold leading-none"
              style={{ color: COLORS.silverPink }}
          >
              {String(value).padStart(2, '0')}
          </div>
          {/* Taupe Gray labels */}
          <div
              className="text-sm uppercase tracking-wider mt-1"
              style={{ color: COLORS.almond }}
          >
              {label}
          </div>
      </div>
  );

  return (
    <section
    className="relative py-20 min-h-[600px] overflow-hidden"
    id="countdown"
  >
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/countdown.jpeg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  
    {/* Optional overlay */}
    <div
      className="absolute inset-0"
      style={{ backgroundColor: COLORS.mountainPink + '66' }} // 40% overlay
    />
  
    {/* Content */}
    <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center flex flex-col justify-center items-center h-full">
      <h3
        className="text-6xl md:text-7xl font-serif mb-12 flex items-center justify-center"
        style={{ color: COLORS.almond }}
      >
        <Clock className="w-8 h-8 mr-3" style={{ color: COLORS.almond }} />
        {isPast ? 'We are married!' : 'The day is coming soon...'}
      </h3>
  
      {!isPast ? (
        <div
          className="grid grid-cols-4 gap-6 max-w-md mx-auto"
          style={{ borderColor: COLORS.oldLavender }}
        >
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Mins" />
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>
      ) : (
        <p
          className="text-3xl md:text-4xl font-serif italic mt-10"
          style={{ color: COLORS.almond }}
        >
          Thank you for celebrating with us!
        </p>
      )}
    </div>
  </section>
  );
};


/**
 * Section for RSVP form (RSVP).
 */

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfjfVE-fCDLV_G5Bk9efYhcYk2-lJ78kPphtuel3CvpQENBYQ/formResponse';

const RsvpSection: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isAttending, setIsAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const guestOptions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1} Person{i + 1 > 1 ? 's' : ''}
      </option>
    ));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !mobile) {
      setError('Please provide your name and mobile number.');
      return;
    }

    if (isAttending && guests < 1) {
      setError('Attending RSVP must include at least 1 guest.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('entry.322689216', name);              // Full Name
    formData.append('entry.1326557165', mobile);           // Mobile Number
    formData.append('entry.1799369054', isAttending ? 'Yes' : 'No'); // Attending?
    formData.append('entry.1949303104', guests.toString());          // No. of Guests
    formData.append('entry.1613417117', message);           // Message

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setIsSubmitted(true);
      setName('');
      setMobile('');
      setIsAttending(true);
      setGuests(1);
      setMessage('');
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="py-20 text-stone-900"
      style={{ backgroundColor: '#F5F0E6' }}
    >
      <div className="container mx-auto px-6 max-w-xl">
        <h2
          className="text-4xl font-serif text-center mb-4 border-b-2 pb-2 inline-block"
          style={{
            color: '#796878',
            borderColor: 'rgba(216, 140, 161, 0.5)',
          }}
        >
          Kindly RSVP
        </h2>
        <p
          className="text-center text-lg mb-8"
          style={{ color: '#8B8589' }}
        >
          Please confirm your attendance by{' '}
          <span style={{ fontWeight: 600, color: '#D88CA1' }}>
            {COUPLE_INFO.rsvpDeadline}
          </span>
          .
        </p>

        {isSubmitted ? (
          <div
            className="text-center p-10 rounded-xl shadow-lg"
            style={{ backgroundColor: '#ECFDF5', border: '4px solid #BBF7D0' }}
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#16A34A' }} />
            <h3 className="text-2xl font-serif" style={{ color: '#15803D' }}>
              Thank You!
            </h3>
            <p className="text-lg mt-2">Your RSVP has been recorded. We can't wait to see you!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-xl shadow-2xl"
            style={{ backgroundColor: 'white', border: '1px solid #D1D5DB' }}
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#8B8589' }}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Jane Doe"
                className="w-full px-4 py-2 rounded-lg transition duration-150"
                style={{ border: '1px solid #D1D5DB', outlineColor: '#D88CA1' }}
              />
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium mb-1" style={{ color: '#8B8589' }}>
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={isSubmitting}
                placeholder="09123456789"
                className="w-full px-4 py-2 rounded-lg transition duration-150"
                style={{ border: '1px solid #D1D5DB', outlineColor: '#D88CA1' }}
              />
            </div>

            {/* Attending */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B8589' }}>
                Will you be able to attend?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAttending(true)}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200"
                  style={{
                    backgroundColor: isAttending ? '#D88CA1' : '#F3F3F3',
                    color: isAttending ? 'white' : '#8B8589',
                    border: isAttending ? 'none' : '1px solid #D1D5DB',
                  }}
                >
                  Yes, with pleasure
                </button>
                <button
                  type="button"
                  onClick={() => setIsAttending(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200"
                  style={{
                    backgroundColor: !isAttending ? '#8B8589' : '#F3F3F3',
                    color: !isAttending ? 'white' : '#8B8589',
                    border: !isAttending ? 'none' : '1px solid #D1D5DB',
                  }}
                >
                  Regretfully, no
                </button>
              </div>
            </div>

            {/* Guests */}
            {isAttending && (
              <div>
                <label htmlFor="guests" className="block text-sm font-medium mb-1" style={{ color: '#8B8589' }}>
                  Number of Guests (Including you)
                </label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg transition duration-150"
                  style={{
                    border: '1px solid #D1D5DB',
                    outlineColor: '#D88CA1',
                    backgroundColor: 'white',
                  }}
                >
                  {guestOptions}
                </select>
              </div>
            )}

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: '#8B8589' }}>
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                placeholder="Any special requests or messages?"
                rows={3}
                className="w-full px-4 py-2 rounded-lg transition duration-150"
                style={{ border: '1px solid #D1D5DB', outlineColor: '#D88CA1' }}
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm text-lg font-medium transition duration-300"
              style={{ backgroundColor: '#D88CA1', color: 'white' }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Submit RSVP <Mail className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

const PrenupGallerySection: React.FC = () => {
  // Images array (using larger resolution for the main preview)
  const images = Array.from({ length: 34 }, (_, i) => `/images/prenup${i + 1}.jpeg`);

  const sectionBgUrl = "/images/prenup10.jpeg";
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  return (
    <section
    id="gallery"
    className="relative py-20 text-stone-900 bg-fixed bg-center bg-cover"
    style={{ backgroundImage: `url(${sectionBgUrl})` }}
  >
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-[rgba(251,201,167,0.7)] z-0 pointer-events-none"
      aria-hidden="true"
    ></div>
  
    {/* Content */}
    <div className="relative z-10 container mx-auto px-6 max-w-4xl">
      <h2 className="text-4xl font-serif text-center mb-12 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.oldLavender}]">
        Our Prenup Gallery
      </h2>
  
      <p className="text-center text-lg mb-10 text-[${COLORS.taupeGray}] italic max-w-2xl mx-auto">
        A glimpse into the love, laughter, and light that led us to this moment.
      </p>

              <div className="space-y-4">
                  {/* --- 1. LARGE PREVIEW IMAGE --- */}
                  <div className="relative overflow-hidden aspect-video md:aspect-w-16 md:aspect-h-9 rounded-xl shadow-2xl border-4 border-white transition-opacity duration-500">
                      <img
                          key={selectedIndex} // Key change forces image re-render/fade
                          src={selectedImage}
                          alt={`Prenup Photo ${selectedIndex + 1}`}
                          className="w-full h-full object-cover animate-fade-in-slow"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://placehold.co/1080x608/${COLORS.mountainPink.substring(1)}/EAD6C6?text=Preview+Image`;
                          }}
                          style={{ transition: 'opacity 0.5s ease-in-out' }}
                      />
                       <Camera className="absolute bottom-4 right-4 w-8 h-8 text-white drop-shadow-lg opacity-80"/>
                  </div>

                  {/* --- 2. THUMBNAIL ROW --- */}
                  <div className="flex justify-center space-x-2 md:space-x-4 overflow-x-auto p-2">
                      {images.map((src, index) => (
                          <button
                              key={index}
                              onClick={() => setSelectedIndex(index)}
                              className={`
                                  w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 transform 
                                  shadow-md hover:opacity-90 hover:scale-[1.05]
                                  ${selectedIndex === index 
                                      ? `border-4 border-[${COLORS.mountainPink}] scale-[1.08] shadow-lg` 
                                      : `border-2 border-stone-300 opacity-60`
                                  }
                              `}
                          >
                              <img
                                  src={src.replace('w=1080', 'w=200')} // Use smaller image for thumbnail load time
                                  alt={`Thumbnail ${index + 1}`}
                                  onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = `https://placehold.co/80x80/${COLORS.mountainPink.substring(1)}/EAD6C6?text=T${index+1}`;
                                  }}
                                  className="w-full h-full object-cover"
                              />
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </section>
  );
};


/**
 * Section for Prenup/Registry Information.
 */
const PrenupSection: React.FC = () => {
  const giftBgUrl = '/images/ourstory3.jpeg'; // Replace with your gift box background image

  return (
    // Background: Gradient Old Lavender
    <section
      id="prenup"
      className="py-20 relative text-stone-900"
      style={{
        background: 'linear-gradient(135deg, rgb(130,103,112) 0%, rgb(230,210,230) 100%)', // Gradient Old Lavender
      }}
    >
      <div className="container mx-auto px-6 max-w-6xl text-center relative z-10">
        {/* Headline: Old Lavender */}
        <h2
          className="text-6xl font-serif mb-12 border-b-2 pb-2 inline-block"
          style={{ color: '#EAD6C6', borderColor: '#C4AEB2' }} // Mountain Pink border semi-transparent
        >
          Gifts
        </h2>

        {/* Gift Box Card with bg image and overlay */}
        <div
          className="relative p-10 shadow-2xl rounded-xl text-center border-t-4 overflow-hidden"
          style={{
            borderColor: '#D88CA1', // Mountain Pink top border
            color: '#826970', // Old Lavender text for headings
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${giftBgUrl})`, zIndex: 0 }}
          />

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }} // 30% dark overlay
          />

          {/* Content */}
          <div className="relative z-10">
          
            <h3 className="text-3xl font-semibold font-serif mb-4" style={{ color: '#F5F5F5' }}>
              Your Presence is Our Present
            </h3>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: '#F5F5F5' }}>
            Your presence at our wedding is the greatest gift we could ask for, and we truly look forward to celebrating this special day with you. For those who wish to honor us with a gift, we have created a monetary gift registry to help us start this new chapter together. Your thoughtful gifts will be deeply appreciated, but please know that having you there to share in our joy means the most to us.
            </p>
            <img 
            src="/images/gift.png" // replace with your actual PNG path
            alt="Gift"
            className="w-40 h-auto mx-auto mb-4"
          />
          </div>
        </div>
      </div>

      {/* Optional overlay on section if needed */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(130,103,112,0.1)', zIndex: 0 }}
      />
    </section>
  );
};

/**
 * Section for key event details (Location).
 */
const LocationSection: React.FC = () => {
  const ceremonyArea = "Jardin de Corazon";
  const receptionArea = "Sampaguita Hall";
  const baseAddress = `${COUPLE_INFO.venue}, ${COUPLE_INFO.address}`;

  const ceremonyMapUrl = 'https://maps.app.goo.gl/HE8VS1QkWprSY8zE8';
  const receptionMapUrl = 'https://maps.app.goo.gl/HE8VS1QkWprSY8zE8';

  type IconComponent = typeof MapPin | typeof Compass;

  interface DetailCardProps {
    title: string;
    time: string;
    area: string;
    description: string;
    isLeft: boolean;
    mapUrl: string;
    MapIconComponent: IconComponent;
  }

  const DetailCard: React.FC<DetailCardProps> = ({
    title,
    time,
    area,
    description,
    isLeft,
    mapUrl,
    MapIconComponent,
  }) => (
    <div
      className={`p-6 md:p-8 bg-white shadow-2xl rounded-xl transition duration-300 transform hover:scale-[1.01] ${
        isLeft ? "md:mr-[-3rem]" : "md:ml-[-3rem]"
      } z-10`}
    >
      <div className="flex items-center mb-3">
        <Calendar className="w-6 h-6 mr-3" style={{ color: COLORS.mountainPink }} />
        <h3
          className="text-3xl font-serif"
          style={{ color: COLORS.oldLavender }}
        >
          {title}
        </h3>
      </div>

      <p className="text-2xl font-semibold mb-2 text-stone-900">{time}</p>
      <p
        className="text-lg italic border-b border-stone-200 pb-3 mb-3"
        style={{ color: COLORS.taupeGray }}
      >
        {area}
      </p>
      <p
        className="text-base leading-relaxed"
        style={{ color: COLORS.taupeGray }}
      >
        {description}
      </p>

      {/* Map Button */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider shadow-lg transition duration-300 transform hover:scale-[1.03]"
        style={{
          backgroundColor: COLORS.mountainPink,
          color: "white",
        }}
      >
        <MapIconComponent className="w-5 h-5 mr-2" />
        View Map
      </a>
    </div>
  );

  const ImageBlock: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <div
      className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-4"
      style={{ borderColor: COLORS.mountainPink }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://placehold.co/800x600/${COLORS.mountainPink.substring(
            1
          )}/EAD6C6?text=${alt.replace(/\s/g, "+")}`;
        }}
      />
    </div>
  );

  return (
    <section
      id="location"
      className="relative py-20"
      style={{ backgroundColor: COLORS.oldLavender }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <h2
          className="text-4xl font-serif text-center mb-16 border-b-2 pb-2 inline-block"
          style={{
            color: COLORS.almond,
            borderColor: COLORS.mountainPink + "80",
          }}
        >
          The Celebration Venue
        </h2>

        <p
          className="text-center text-xl font-medium mb-12"
          style={{ color: COLORS.almond }}
        >
          {COUPLE_INFO.venue}, {COUPLE_INFO.address}
        </p>

        {/* Ceremony Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-5 order-1">
            <ImageBlock
              src="images/ceremony.jpg"
              alt="Outdoor Ceremony Setup"
            />
          </div>

          <div className="lg:col-span-7 order-2">
            <DetailCard
              title="The Ceremony"
              time="2:30 PM"
              area={ceremonyArea}
              description="MARIA PAZ ROYALE GARDEN, JARDIN DE CORAZON.
              BRGY. STA FILOMENA, SAN PABLO CITY (CLICK/SCAN TO OPEN IN GOOGLE MAPS).. Join us as we exchange vows in the beautiful Jardin de Corazon. Please arrive at least 15–20 minutes early for seating."
              isLeft={false}
              mapUrl={ceremonyMapUrl}
              MapIconComponent={MapPin}
            />
          </div>
        </div>

        {/* Reception Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <DetailCard
              title="The Reception"
              time="6:00 PM"
              area={receptionArea}
              description="MARIA PAZ ROYALE GARDEN, SAMPAGUITA HALL. 
              BRGY. STA FILOMENA, SAN PABLO CITY (CLICK/SCAN TO OPEN IN GOOGLE MAPS). Celebrate with dinner, drinks, and dancing immediately following the ceremony in the elegant Sampaguita Hall. Let the party begin!"
              isLeft={true}
              mapUrl={receptionMapUrl}
              MapIconComponent={Compass}
            />
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <ImageBlock
              src="images/sampaguitahall.jpg"
              alt="Indoor Reception Hall"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


/**
 * Section for wedding entourage/party.
 */
const EntourageSection: React.FC = () => (
  // Background: Silver Pink (so itconst EntourageSection: React.FC = () => (
  <section
  id="entourage"
  className="py-20 text-stone-900"
  style={{ backgroundColor: COLORS.silverPink }} // ✅ Fixed bg color
>
  <div className="container mx-auto px-6 max-w-6xl">
    {/* Headline */}
    <h2
      className="text-4xl font-serif text-center mb-16 border-b-2 pb-2 inline-block"
      style={{
        color: COLORS.oldLavender,
        borderColor: COLORS.mountainPink + "80",
      }}
    >
      The Entourage
    </h2>

    {/* 1. Parents & Core Bridal Party */}
    <div
      className="bg-white p-8 md:p-12 rounded-xl shadow-2xl mb-12 border-t-4"
      style={{ borderColor: COLORS.oldLavender }}
    >
      <h3
        className="text-3xl font-serif text-center mb-8"
        style={{ color: COLORS.mountainPink }}
      >
        Parents of the Bride & Groom
      </h3>

      <div className="grid md:grid-cols-2 gap-8 text-center mb-10 border-b pb-8 border-stone-200">
        {/* Groom’s Parents */}
        <div>
          <h4
            className="text-xl font-bold mb-2"
            style={{ color: COLORS.oldLavender }}
          >
            Parents of the Groom
          </h4>
          <p style={{ color: COLORS.taupeGray }}>
            {COUPLE_INFO.parentsGroom.father}
          </p>
          <p style={{ color: COLORS.taupeGray }}>
            {COUPLE_INFO.parentsGroom.mother}
          </p>
        </div>

        {/* Bride’s Parents */}
        <div>
          <h4
            className="text-xl font-bold mb-2"
            style={{ color: COLORS.oldLavender }}
          >
            Parents of the Bride
          </h4>
          <p style={{ color: COLORS.taupeGray }}>
            {COUPLE_INFO.parentsBride.father}
          </p>
          <p style={{ color: COLORS.taupeGray }}>
            {COUPLE_INFO.parentsBride.mother}
          </p>
        </div>
      </div>

      <h3
        className="text-3xl font-serif text-center mb-8"
        style={{ color: COLORS.mountainPink }}
      >
        Best Men & Maids of Honor
      </h3>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        {/* Best Men */}
        <div>
          <h4
            className="text-xl font-bold mb-3 border-b-2 inline-block"
            style={{
              color: COLORS.oldLavender,
              borderColor: COLORS.silverPink,
            }}
          >
            Best Men
          </h4>
          <ul className="space-y-1 text-base" style={{ color: COLORS.taupeGray }}>
            {ENTOURAGE_DATA.bestMan.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>

        {/* Maids of Honor */}
        <div>
          <h4
            className="text-xl font-bold mb-3 border-b-2 inline-block"
            style={{
              color: COLORS.oldLavender,
              borderColor: COLORS.silverPink,
            }}
          >
            Maids of Honor
          </h4>
          <ul className="space-y-1 text-base" style={{ color: COLORS.taupeGray }}>
            {ENTOURAGE_DATA.maidsOfHonor.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>

        {/* Matron of Honor */}
        <div>
          <h4
            className="text-xl font-bold mb-3 border-b-2 inline-block"
            style={{
              color: COLORS.oldLavender,
              borderColor: COLORS.silverPink,
            }}
          >
            Matron of Honor
          </h4>
          <ul className="space-y-1 text-base" style={{ color: COLORS.taupeGray }}>
            {ENTOURAGE_DATA.matronOfHonor.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* 2. Principal Sponsors */}
    <div
      className="p-8 md:p-12 rounded-xl shadow-2xl border-t-4"
      style={{
        borderColor: COLORS.mountainPink,
        backgroundColor: COLORS.almond,
      }}
    >
      <h3
        className="text-3xl font-serif text-center mb-8"
        style={{ color: COLORS.oldLavender }}
      >
        Principal Sponsors (Ninongs & Ninangs)
      </h3>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
        {/* Gentlemen */}
        <div>
          <h4
            className="text-xl font-bold mb-4 text-center"
            style={{ color: COLORS.mountainPink }}
          >
            Gentlemen
          </h4>
          <ul className="space-y-1 text-sm" style={{ color: COLORS.taupeGray }}>
            {ENTOURAGE_DATA.principalSponsors.male.map((name, i) => (
              <li
                key={i}
                className="py-0.5 border-b border-stone-200 last:border-b-0 text-center"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Ladies */}
        <div>
          <h4
            className="text-xl font-bold mb-4 text-center"
            style={{ color: COLORS.mountainPink }}
          >
            Ladies
          </h4>
          <ul className="space-y-1 text-sm" style={{ color: COLORS.taupeGray }}>
            {ENTOURAGE_DATA.principalSponsors.female.map((name, i) => (
              <li
                key={i}
                className="py-0.5 border-b border-stone-200 last:border-b-0 text-center"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* 3. Secondary Sponsors */}
    <div className="p-8 md:p-12 rounded-xl shadow-2xl mt-12 bg-white">
      <h3
        className="text-3xl font-serif text-center mb-8"
        style={{ color: COLORS.oldLavender }}
      >
        Secondary Sponsors
      </h3>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        {ENTOURAGE_DATA.secondarySponsors.map((sponsor, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-stone-200 shadow-sm"
          >
            <h4
              className="text-2xl font-serif font-semibold mb-3"
              style={{ color: COLORS.mountainPink }}
            >
              {sponsor.role}
            </h4>
            <p style={{ color: COLORS.taupeGray }}>{sponsor.couple[0]}</p>
            <p className="text-sm text-stone-500 my-1 italic">and</p>
            <p style={{ color: COLORS.taupeGray }}>{sponsor.couple[1]}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
);


/**
 * Section for Dress Code information.
 */
const DressCodeSection: React.FC = () => (
  <section
    id="dresscode"
    className="relative py-24 text-stone-900 bg-fixed bg-center bg-cover"
    style={{
      backgroundImage: "url('/images/prenup20.jpeg')",
    }}
  >
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"
      aria-hidden="true"
    ></div>

    <div className="relative container mx-auto px-6 max-w-4xl text-center z-10">
      {/* Elegant Heading */}
      <h2
        className="text-4xl md:text-5xl font-serif tracking-wide mb-10"
        style={{ color: "#796878" }} // Old Lavender
      >
        Attire Guidance
      </h2>

      {/* Main Card */}
      <div
        className="p-10 md:p-12 bg-white/90 shadow-2xl rounded-2xl border-t-4"
        style={{ borderColor: "#D88CA1" }} // Mountain Pink
      >
        {/* Attire Info */}
        <div className="space-y-10 text-left">
          {/* Principal Sponsors */}
          <div
            className="p-6 bg-stone-50 rounded-lg border-l-4 shadow-sm"
            style={{ borderColor: "#D88CA1" }}
          >
            <h4
              className="font-serif text-2xl mb-3"
              style={{ color: "#796878" }}
            >
              Principal Sponsors
            </h4>
            <p className="text-lg leading-relaxed" style={{ color: "#8B8589" }}>
              <strong>Gentlemen:</strong> Barong Tagalog
            </p>
            <p className="text-lg leading-relaxed" style={{ color: "#8B8589" }}>
              <strong>Ladies:</strong> Filipiniana Dress
            </p>
          </div>

          {/* Guests */}
          <div
            className="p-6 bg-stone-50 rounded-lg border-l-4 shadow-sm"
            style={{ borderColor: "#D88CA1" }}
          >
            <h4
              className="font-serif text-2xl mb-3"
              style={{ color: "#796878" }}
            >
              Guests
            </h4>
            <p className="text-lg leading-relaxed" style={{ color: "#8B8589" }}>
              <strong>Gentlemen:</strong> Formal Suit or Barong Tagalog
            </p>
            <p className="text-lg leading-relaxed" style={{ color: "#8B8589" }}>
              <strong>Ladies:</strong> Formal Dress
            </p>
          </div>
        </div>

        {/* Note */}
        <p
          className="mt-12 text-base md:text-lg text-center italic border-t border-stone-200 pt-6"
          style={{ color: "#8B8589" }}
        >
          We kindly ask all guests to follow the suggested attire for a cohesive
          and elegant celebration.
        </p>

        {/* Visual Examples */}
        <div className="pt-12">
          <h5
            className="text-lg md:text-xl font-medium mb-8"
            style={{ color: "#796878" }}
          >
            Visual Inspiration
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gentlemen */}
            <div className="flex flex-col rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition">
              <img
                src="/images/dress2.png"
                alt="Formal Suit or Barong"
                className="w-full h-auto object-cover"
              />
              <div className="bg-gray-50 p-4 text-center text-sm font-medium text-gray-700">
                Formal Suit
              </div>
            </div>

            {/* Ladies */}
            <div className="flex flex-col rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition">
              <img
                src="/images/dress3.png"
                alt="Formal Dress"
                className="w-full h-auto object-cover"
              />
              <div className="bg-gray-50 p-4 text-center text-sm font-medium text-gray-700">
                Elegant Formal Dress
              </div>
            </div>

            {/* Color Theme */}
            <div className="flex flex-col rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition">
              <img
                src="/images/dress1.png"
                alt="Wedding Color Theme"
                className="w-full h-auto object-cover"
              />
              <div className="bg-gray-50 p-4 text-center text-sm font-medium text-gray-700">
                Wedding Color Palette Inspiration
              </div>
            </div>
          </div>

          {/* 🎨 Color Palette Circles */}
          <div className="flex justify-center items-center gap-6 mt-12">
            {[
              "#906272", // mountainPink
              "#C4AEB2", // silverPink
              "#EAD6C6", // almond
              "#878784", // taupeGray
              "#796A7E", // oldLavender
            ].map((color, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-full shadow-md border border-white"
                style={{ backgroundColor: color }}
                title={color}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);



// --- PAGE COMPONENTS ---

/**
 * Contains the Hero, Story, Countdown, and RSVP form.
 */
const HomePage: React.FC = () => (
    <>
        <CoverSection />
        <InviteSection />
        <PreludeSection />
        <CountdownSection />
        <RsvpSection />
    </>
);

/**
 * Contains Prenup, Location, Entourage, and Dress Code sections.
 */
const DetailsPage: React.FC = () => (
  <div id="details-top" className="pt-20"> 
      <PrenupGallerySection /> {/* New Gallery Section */}
      <PrenupSection />      {/* Renamed/Updated Gifts Section */}
      <LocationSection />
      <EntourageSection />
      <DressCodeSection />
  </div>
);


// --- MAIN APP COMPONENT ---

/**
 * The main application component for the wedding invitation website.
 * @returns JSX.Element
 */
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'details' | 'rsvp' | 'gallery'>('home');

  
  useSparkleEffect();

  const PageComponent = useMemo(() => {
    switch (currentPage) {
      case 'details':
        return <DetailsPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  }, [currentPage]);
  
  // Custom font setup
  useEffect(() => {
    const playfairLink = document.createElement('link');
    playfairLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap';
    playfairLink.rel = 'stylesheet';
    document.head.appendChild(playfairLink);

    const interLink = document.createElement('link');
    interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
    interLink.rel = 'stylesheet';
    document.head.appendChild(interLink);

    return () => {
      document.head.removeChild(playfairLink);
      document.head.removeChild(interLink);
      // Clean up any extra styles if necessary
      const sparkleStyle = document.getElementById('sparkle-styles');
      if (sparkleStyle) {
        document.head.removeChild(sparkleStyle);
      }
    };
  }, []);

  return (
    // Base background: Almond
    <div className={`min-h-screen bg-[${COLORS.almond}] font-sans antialiased`}>
      <style>
        {`
          .font-serif {
            font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          }
          .font-sans {
            font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          }
          html {
            scroll-padding-top: 5rem;
          }

          /* Sparkle Effect Styles */
          .sparkle-effect {
            position: absolute;
            pointer-events: none;
            background-color: ${COLORS.mountainPink}; /* Mountain Pink */
            border-radius: 50%;
            transition: all 0.5s ease-out;
            z-index: 1000;
            opacity: 0;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out;
            display: inline-block;
          }
          
          .perspective-1000 {
            perspective: 1000px;
          }
        `}
      </style>
      
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main>
        {PageComponent}
      </main>
      
      <FooterSection />
      
    </div>
  );
};

/**
 * Footer/Contact Information Section.
 */
const FooterSection: React.FC = () => (
  <footer
    style={{ backgroundColor: COLORS.taupeGray, color: COLORS.almond }}
    className="py-10"
  >
    <div className="container mx-auto px-6 text-center">
      <p className="text-lg font-serif mb-4">
        We can't wait to share our big day with you!
      </p>
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" style={{ color: COLORS.mountainPink }} />
          <span>Save the Date: {COUPLE_INFO.date}</span>
        </div>
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2" style={{ color: COLORS.mountainPink }} />
          <span>Contact: ulyssesdeanne.thejcstudios.com</span>
        </div>
      </div>
      <p className="mt-8 text-xs" style={{ color: COLORS.silverPink }}>
        &copy; {new Date().getFullYear()} Ulysses & Deanne. All rights reserved.
      </p>
    </div>
  </footer>
);


export default App;