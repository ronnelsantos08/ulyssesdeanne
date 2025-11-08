"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Heart, MapPin, Calendar, Mail, CheckCircle, Menu, X, Clock, Gift, Camera } from 'lucide-react';


// --- CONFIGURATION ---
const COUPLE_INFO = {
  bride: "Deanne",
  groom: "Ulysses",
  date: "January 10, 2026", 
  time: "4:00 PM",
  venue: "Willow Creek Estate",
  address: "123 Grand Ave, Beverly Hills, CA 90210",
  rsvpDeadline: "September 15, 2025",
  dressCode: "Formal Attire (Black tie optional)",
  weddingDate: new Date("January 10, 2026 16:00:00").getTime(), 
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
const NavBar: React.FC<{ currentPage: PageType, setCurrentPage: (page: PageType) => void }> = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = useCallback((page: PageType, section: string) => {
    setCurrentPage(page);
    setIsOpen(false);
    document.querySelector(section)?.scrollIntoView({ behavior: 'smooth' });
  }, [setCurrentPage]);

  return (
    <nav className={`fixed top-0 left-0 w-full bg-[${COLORS.oldLavender}]/50 backdrop-blur-sm z-50 shadow-lg`}>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">
      
      {/* Logo / Couple Name */}
      <a
        href="#home"
        onClick={() => handleNavClick('home', '#home')}
        className={`text-2xl font-serif font-bold text-[${COLORS.almond}] tracking-widest`}
      >
        {COUPLE_INFO.bride} & {COUPLE_INFO.groom}
      </a>

      {/* Desktop Links */}
      <div className="hidden lg:flex space-x-6">
        {NAV_LINKS.map(link => (
          <button
            key={link.name}
            onClick={() => handleNavClick(link.page as PageType, link.section)}
            className={`text-sm font-serif transition duration-200 uppercase tracking-widest relative px-1 py-2
              ${
                currentPage === link.page
                  ? `text-[${COLORS.almond}] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[${COLORS.mountainPink}]`
                  : `text-[${COLORS.silverPink}] hover:text-[${COLORS.mountainPink}]`
              }`}
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className={`lg:hidden text-[${COLORS.silverPink}] hover:text-[${COLORS.mountainPink}] p-2 rounded-full transition duration-150`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {isOpen && (
    <div className={`lg:hidden pb-4 transition-all duration-300 ease-in-out bg-[${COLORS.taupeGray}]/95`}>
      {NAV_LINKS.map(link => (
        <button
          key={link.name}
          onClick={() => handleNavClick(link.page as PageType, link.section)}
          className={`block w-full text-left px-4 py-3 text-base text-[${COLORS.silverPink}] hover:bg-[${COLORS.mountainPink}]/50 hover:text-[${COLORS.almond}] uppercase tracking-wider font-medium border-t border-[${COLORS.almond}]/20`}
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
const CoverSection: React.FC = () => (
  <header id="home" className="relative h-screen flex items-center justify-center text-white overflow-hidden pt-20">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/images/hero.jpeg")',
        filter: 'brightness(0.5)'
      }}
    >
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center"></div>
    </div>

    <TextCarousel />

    {/* Content Box */}
    <div className="relative z-10 text-center p-6 sm:p-8 md:p-12 bg-black/40 backdrop-blur-sm rounded-xl max-w-xl mx-4 border-2 border-[#906272]">
      <p className="text-lg md:text-xl font-serif italic mb-4 tracking-widest">
        The wedding celebration of
      </p>

      {/* Names */}
      <h1 className="flex flex-wrap justify-center items-center text-white font-serif font-bold mb-4 leading-tight">
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">{COUPLE_INFO.bride}</span>
        <span className={`mx-2 text-[${COLORS.mountainPink}] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}> &amp; </span>
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">{COUPLE_INFO.groom}</span>
      </h1>

      <p className="text-xl sm:text-2xl md:text-3xl font-serif border-y border-white/50 py-3 mt-6">
        {COUPLE_INFO.date}
      </p>

      <p className="text-lg sm:text-xl mt-4 font-light tracking-wider">
        {COUPLE_INFO.venue}
      </p>

      {/* RSVP Button */}
      <a 
        href="#rsvp"
        className={`mt-8 inline-flex items-center px-8 py-3 border border-[${COLORS.mountainPink}] text-white uppercase tracking-widest hover:bg-[${COLORS.mountainPink}] transition duration-300 rounded-full text-sm sm:text-base font-semibold shadow-lg`}
      >
        RSVP Now <Heart className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
      </a>
    </div>
  </header>
);


/**
 * NEW SECTION: Invitation Text (Inserted after CoverSection)
 */
const InviteSection: React.FC = () => (
    // Background: Silver Pink (a soft, gentle transition from the dark hero)
    <section id="invite" className={`py-16 md:py-20 bg-[${COLORS.silverPink}] text-stone-900`}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
            {/* Headline/Title: Old Lavender */}
            <h2 className={`font-serif text-4xl md:text-5xl text-[${COLORS.oldLavender}] mb-8`}>
                We Invite You
            </h2>
            <div className="max-w-3xl mx-auto">
                {/* Quote: Taupe Gray text, italic, large */}
                <p className={`text-xl md:text-2xl italic text-[${COLORS.taupeGray}] leading-relaxed font-light`}>
                    Our paths crossed by chance, but our hearts chose each other with purpose.
                    Now, we're ready to celebrate a love that's grown deep and true.
                    Please join us on January 10, 2026 as we begin our next chapter, surrounded by the warmth of your presence.
                </p>
            </div>
            {/* Signature/Date: Mountain Pink accent color */}
            <p className={`mt-10 text-lg text-[${COLORS.mountainPink}] font-serif font-semibold`}>
                Deanne & Ulysses
                <br />
                <span className="text-sm uppercase tracking-wider text-stone-500">The Beginning of Forever</span>
            </p>
        </div>
    </section>
);


/**
 * Component to simulate stacked photo album pages.
 */
const BookOfMemories: React.FC = () => {
    // NEW THEME: Pages array now uses all colors
    const pages = [
        { key: 1, bg: COLORS.silverPink, text: COLORS.oldLavender, rotation: '-rotate-3', translate: '-translate-x-4', label: "Our First Date" },
        { key: 2, bg: COLORS.almond, text: COLORS.oldLavender, rotation: 'rotate-1', translate: 'translate-x-2', label: "The Proposal" },
        // Dark card, light text
        { key: 3, bg: COLORS.mountainPink, text: COLORS.almond, rotation: '-rotate-2', translate: '-translate-x-1', label: "Travels" }, 
        // Dark card, light text
        { key: 4, bg: COLORS.oldLavender, text: COLORS.almond, rotation: 'rotate-3', translate: 'translate-x-4', label: "Adventures" }, 
        { key: 5, bg: COLORS.almond, text: COLORS.oldLavender, rotation: 'rotate-1', translate: '-translate-x-2', label: "Our Family" },
    ];
    
    const baseStyle = "absolute w-full h-full bg-cover bg-center rounded-lg shadow-xl border border-stone-200 p-4 transform transition duration-500 ease-in-out hover:shadow-2xl";

    return (
        <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md h-[400px] perspective-1000 mx-auto">
            <div className="relative w-full h-full">
                {pages.map((page, index) => (
                    <div
                        key={page.key}
                        className={`${baseStyle} ${page.rotation} ${page.translate} 
                                    flex items-center justify-center text-center 
                                    font-serif italic`}
                        style={{ 
                            backgroundColor: page.bg,
                            color: page.text,
                            zIndex: 5 - index, 
                            top: `${index * 5}px`, 
                            left: 0,
                        }}
                    >
                        {/* Icon color matches text color */}
                        <Camera className={`w-8 h-8 mr-2`} style={{ color: page.text === COLORS.oldLavender ? COLORS.mountainPink : page.text }} />
                        <span className="text-sm uppercase tracking-wider">{page.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


/**
 * Section for the couple's story (Story).
 */
const PreludeSection: React.FC = () => (
  // Background: Almond
  <section id="story" className={`py-20 bg-[${COLORS.almond}] text-stone-900`}>
    <div className="container mx-auto px-6 max-w-6xl">
      {/* Headline: Old Lavender */}
      <h2 className={`text-4xl font-serif text-center mb-12 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.oldLavender}]`}>Our Story</h2>
      
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Book/Image Fanning Effect (Col Span 5) */}
        <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            {/* NEW THEME: Book component now uses all colors */}
            <BookOfMemories />
        </div>
        
        {/* RIGHT COLUMN: Story Text (Col Span 7) */}
        <div className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2">
            {/* Text: Taupe Gray */}
            <p className={`text-lg text-[${COLORS.taupeGray}] leading-relaxed mb-6`}>
                Our story began in the most unexpected way—with a simple message on Facebook Messenger that changed everything. What started as a friendly chat soon turned into daily conversations filled with laughter, late-night stories, and a spark we couldn't ignore. Before we knew it, those messages became memories, and those memories became love. On May 31, 2025, Ulysses proposed at the perfect moment, with both of our families present. And with a heart full of joy, I said YES.
            </p>
            <p className={`text-lg text-[${COLORS.taupeGray}] leading-relaxed mb-8`}>
                After eight years of building our life together—six of which we've shared a home, dreams, and the beautiful chaos of parenthood with our little four-year-old—we've come to a moment that feels both natural and extraordinary. Every sleepless night, every laughter-filled morning, every small victory and setback has woven us closer, shaping a family that is ours alone. So here we are, ready to take the next step—not just as partners, not just as parents, but as lifelong companions—asking each other, with full hearts, to make this commitment official: to promise, forever, the love and life we've already so beautifully shared.
            </p>
            {/* Quote: Old Lavender */}
            <p className={`text-xl font-serif italic text-[${COLORS.oldLavender}]`}>
                "Every great love story is beautiful, but ours is my favorite."
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
            {/* Old Lavender digits (good contrast against white card) */}
            <div className={`text-5xl font-sans font-extrabold text-[${COLORS.oldLavender}] leading-none`}>
                {String(value).padStart(2, '0')}
            </div>
            {/* Taupe Gray labels (good contrast against white card) */}
            <div className={`text-sm uppercase tracking-wider text-[${COLORS.taupeGray}] mt-1`}>
                {label}
            </div>
        </div>
    );

    return (
        // Set section to relative and give it padding and minimum height
        <section id="countdown" className="relative py-20 min-h-[300px] overflow-hidden">
            {/* Background Image and Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                    // Romantic ambient lighting image
                    backgroundImage: 'url("https://images.unsplash.com/photo-1596280045339-44431ccdb7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQzMXwwfDF8c2VhcmNofDEzfHxnbG93aW5nJTIwd2VkZGluZyUyMGxpZ2h0c3xlbnwwfHx8fDE3MTkyNjYyMjh8MA&lib=rb-4.0.3&q=80&w=1080")', 
                }}
            >
                {/* Dark overlay for contrast, using Mountain Pink. Increased opacity to 90% for better readability. */}
                <div className={`absolute inset-0 bg-[${COLORS.mountainPink}]/90`}></div> 
            </div>

            {/* Content sits on top of the image (relative z-10) */}
            <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
                {/* Almond text (high contrast against dark overlay) */}
                <h3 className={`text-3xl font-serif mb-8 flex items-center justify-center text-[${COLORS.almond}]`}>
                    <Clock className={`w-6 h-6 mr-3 text-[${COLORS.almond}]`} /> 
                    {isPast ? "We are married!" : "The day is coming soon..."}
                </h3>
                
                {!isPast ? (
                    // White card for contrast
                    <div className={`grid grid-cols-4 gap-4 max-w-md mx-auto bg-white p-6 rounded-xl shadow-xl border-t-4 border-[${COLORS.oldLavender}]`}>
                        <TimeBlock value={timeLeft.days} label="Days" />
                        <TimeBlock value={timeLeft.hours} label="Hours" />
                        <TimeBlock value={timeLeft.minutes} label="Mins" />
                        <TimeBlock value={timeLeft.seconds} label="Secs" />
                    </div>
                ) : (
                    <p className={`text-xl text-[${COLORS.almond}] font-serif italic`}>
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
const RsvpSection: React.FC = () => {
  const [formData, setFormData] = useState<RsvpFormData>({
    name: '',
    attending: null,
    guests: 1,
    dietaryRestrictions: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'guests') ? parseInt(value) : value,
    }));
  }, []);

  const handleAttendingChange = useCallback((value: 'yes' | 'no') => {
    setFormData(prev => ({
      ...prev,
      attending: value,
      guests: value === 'no' ? 0 : 1, 
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.attending) {
      setError('Please fill in your name and selection.');
      return;
    }
    
    if (formData.attending === 'yes' && formData.guests < 1) {
        setError('Attending RSVP must include at least 1 guest.');
        return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log("Submitting RSVP Data:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  }, [formData]);
  
  const guestOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 6; i++) {
      options.push(<option key={i} value={i}>{i} Person{i > 1 ? 's' : ''}</option>);
    }
    return options;
  }, []);

  return (
    // Background: Almond
    <section id="rsvp" className={`py-20 bg-[${COLORS.almond}] text-stone-900`}>
      <div className="container mx-auto px-6 max-w-xl">
        {/* Headline: Old Lavender */}
        <h2 className={`text-4xl font-serif text-center mb-4 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.oldLavender}]`}>Kindly RSVP</h2>
        <p className={`text-center text-lg mb-8 text-[${COLORS.taupeGray}]`}>
          Please confirm your attendance by <span className={`font-semibold text-[${COLORS.mountainPink}]`}>{COUPLE_INFO.rsvpDeadline}</span>.
        </p>

        {isSubmitted ? (
          <div className="text-center p-10 bg-green-50 border-4 border-green-200 rounded-xl shadow-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-serif text-green-700">Thank You!</h3>
            <p className="text-lg mt-2">
              Your RSVP has been recorded. We can't wait to see you!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-8 border border-stone-200 rounded-xl shadow-2xl bg-white">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium text-[${COLORS.taupeGray}] mb-1`}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[${COLORS.mountainPink}] focus:border-[${COLORS.mountainPink}] transition duration-150`}
                placeholder="John & Jane Doe"
              />
            </div>

            {/* Attending Selection */}
            <div>
              <label className={`block text-sm font-medium text-[${COLORS.taupeGray}] mb-2`}>Will you be able to attend?</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleAttendingChange('yes')}
                  disabled={isSubmitting}
                  // NEW THEME: Mountain Pink solid fill
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                    formData.attending === 'yes' 
                      ? `bg-[${COLORS.mountainPink}] text-white shadow-md` 
                      : `bg-stone-100 text-[${COLORS.taupeGray}] hover:bg-[${COLORS.silverPink}]/50 border border-stone-300`
                  }`}
                >
                  Yes, with pleasure
                </button>
                <button
                  type="button"
                  onClick={() => handleAttendingChange('no')}
                  disabled={isSubmitting}
                  // NEW THEME: Taupe Gray solid fill
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                    formData.attending === 'no' 
                      ? `bg-[${COLORS.taupeGray}] text-white shadow-md` 
                      : `bg-stone-100 text-[${COLORS.taupeGray}] hover:bg-[${COLORS.taupeGray}]/20 border border-stone-300`
                  }`}
                >
                  Regretfully, no
                </button>
              </div>
            </div>

            {/* Guests & Dietary Restrictions */}
            {formData.attending === 'yes' && (
              <>
                <div>
                  <label htmlFor="guests" className={`block text-sm font-medium text-[${COLORS.taupeGray}] mb-1`}>Number of Guests (Including you)</label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[${COLORS.mountainPink}] focus:border-[${COLORS.mountainPink}] transition duration-150 appearance-none bg-white`}
                  >
                    {guestOptions}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dietaryRestrictions" className={`block text-sm font-medium text-[${COLORS.taupeGray}] mb-1`}>Dietary Restrictions / Allergies (Optional)</label>
                  <textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    rows={3}
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-[${COLORS.mountainPink}] focus:border-[${COLORS.mountainPink}] transition duration-150`}
                    placeholder="E.g., Gluten-free, Vegan, Nut allergy"
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm font-medium text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || formData.attending === null}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[${COLORS.mountainPink}] hover:bg-[${COLORS.oldLavender}] disabled:bg-stone-400 transition duration-300 transform hover:scale-[1.01]`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

/**
 * Section for Prenup/Registry Information.
 */
const PrenupSection: React.FC = () => (
  // Background: Almond
  <section id="prenup" className={`py-20 bg-[${COLORS.almond}] text-stone-900`}>
    <div className="container mx-auto px-6 max-w-3xl text-center">
      {/* Headline: Old Lavender */}
      <h2 className={`text-4xl font-serif mb-12 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.oldLavender}]`}>Gifts & Registry</h2>
      
      <div className="p-10 bg-white shadow-2xl rounded-xl text-center border-t-4 border-[${COLORS.mountainPink}]">
        <Gift className={`w-10 h-10 mx-auto mb-4 text-[${COLORS.mountainPink}]`} />
        <h3 className={`text-3xl font-semibold font-serif mb-4 text-[${COLORS.oldLavender}]`}>Your Presence is Our Present</h3>
        <p className={`mt-4 text-lg text-[${COLORS.taupeGray}] leading-relaxed`}>
          The most important gift is your presence on our wedding day. However, should you wish to honor us with a gift, we have two options:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className={`p-6 bg-stone-50 rounded-lg border-l-4 border-[${COLORS.mountainPink}]`}>
                <h4 className="font-bold text-xl mb-2 text-stone-900">Contribution to Our Home</h4>
                <p className={`text-sm text-[${COLORS.taupeGray}]`}>
                    We have a small registry for essential home items.
                </p>
                <a 
                    href="#" 
                    className={`mt-4 inline-block text-[${COLORS.mountainPink}] hover:text-[${COLORS.oldLavender}] text-sm font-semibold transition duration-150 border-b border-[${COLORS.mountainPink}]/50`}
                >
                    View Registry Link
                </a>
            </div>
            <div className={`p-6 bg-stone-50 rounded-lg border-l-4 border-[${COLORS.mountainPink}]`}>
                <h4 className="font-bold text-xl mb-2 text-stone-900">Honeymoon Fund</h4>
                <p className={`text-sm text-[${COLORS.taupeGray}]`}>
                    A contribution towards our dream trip to the Italian Coast would be deeply appreciated.
                </p>
                <a 
                    href="#" 
                    className={`mt-4 inline-block text-[${COLORS.mountainPink}] hover:text-[${COLORS.oldLavender}] text-sm font-semibold transition duration-150 border-b border-[${COLORS.mountainPink}]/50`}
                >
                    Contribute Here
                </a>
            </div>
        </div>
      </div>
    </div>
  </section>
);


/**
 * Section for key event details (Location).
 */
const LocationSection: React.FC = () => (
  // NEW THEME: Old Lavender background
  <section id="location" className={`py-20 bg-[${COLORS.oldLavender}]`}>
    <div className="container mx-auto px-6 max-w-4xl">
      {/* NEW THEME: Almond text, Mountain Pink border */}
      <h2 className={`text-4xl font-serif text-center mb-12 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.almond}]`}>Location & Schedule</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* White cards for contrast */}
        <div className={`p-8 bg-white shadow-lg rounded-xl transition duration-300 hover:shadow-xl hover:border-b-4 hover:border-[${COLORS.mountainPink}]/80`}>
          <Calendar className={`w-8 h-8 mb-4 text-[${COLORS.mountainPink}]`} />
          {/* Headline: Old Lavender */}
          <h3 className={`text-2xl font-serif mb-4 text-[${COLORS.oldLavender}]`}>The Schedule</h3>
          <ul className={`space-y-3 text-left text-[${COLORS.taupeGray}]`}>
            <li className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-medium">4:00 PM</span>
              <span>Ceremony Begins</span>
            </li>
            <li className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-medium">4:45 PM</span>
              <span>Cocktail Hour</span>
            </li>
            <li className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-medium">6:00 PM</span>
              <span>Dinner Reception</span>
            </li>
            <li className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-medium">8:00 PM</span>
              <span>Dancing & Celebration</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">10:00 PM</span>
              <span>Farewell</span>
            </li>
          </ul>
        </div>
        
        <div className={`p-8 bg-white shadow-lg rounded-xl transition duration-300 hover:shadow-xl hover:border-b-4 hover:border-[${COLORS.mountainPink}]/80`}>
          <MapPin className={`w-8 h-8 mb-4 text-[${COLORS.mountainPink}]`} />
          {/* Headline: Old Lavender */}
          <h3 className={`text-2xl font-serif mb-2 text-[${COLORS.oldLavender}]`}>The Venue</h3>
          <p className="text-xl font-semibold text-stone-900">{COUPLE_INFO.venue}</p>
          <p className={`text-[${COLORS.taupeGray}] italic mt-1`}>{COUPLE_INFO.address}</p>
          <div className="mt-6">
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(COUPLE_INFO.address)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center px-4 py-2 bg-[${COLORS.mountainPink}] text-white rounded-lg hover:bg-[${COLORS.oldLavender}] transition duration-150 text-sm font-medium shadow-md`}
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * Section for wedding entourage/party.
 */
const EntourageSection: React.FC = () => (
  // Background: Almond
  <section id="entourage" className={`py-20 bg-[${COLORS.almond}] text-stone-900`}>
    <div className="container mx-auto px-6 max-w-4xl text-center">
      {/* Headline: Old Lavender */}
      <h2 className={`text-4xl font-serif text-center mb-12 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.oldLavender}]`}>The Wedding Party</h2>
      
      <div className="grid md:grid-cols-2 gap-12 text-left">
        
        <div>
          <h3 className={`text-3xl font-serif mb-6 text-[${COLORS.oldLavender}]`}>Deanne's Side</h3>
          <ul className={`space-y-4 text-lg text-[${COLORS.taupeGray}]`}>
            <li><span className="font-bold">Maid of Honor:</span> Sarah Chen</li>
            <li><span className="font-bold">Bridesmaid:</span> Maya Patel</li>
            <li><span className="font-bold">Bridesmaid:</span> Jessica Lee</li>
            <li><span className="font-bold">Bridesmaid:</span> Olivia Rodriguez</li>
          </ul>
        </div>

        <div>
          <h3 className={`text-3xl font-serif mb-6 text-[${COLORS.oldLavender}]`}>Ulysses's Side</h3>
          <ul className={`space-y-4 text-lg text-[${COLORS.taupeGray}]`}>
            <li><span className="font-bold">Best Man:</span> Alex Johnson</li>
            <li><span className="font-bold">Groomsman:</span> Ben Carter</li>
            <li><span className="font-bold">Groomsman:</span> Michael Hsu</li>
            <li><span className="font-bold">Groomsman:</span> David Kim</li>
          </ul>
        </div>
      </div>
      <p className={`text-md italic text-stone-500 mt-12`}>
        Thank you to our amazing friends and family for standing by us.
      </p>
    </div>
  </section>
);

/**
 * Section for Dress Code information.
 */
const DressCodeSection: React.FC = () => (
  // Background: Silver Pink
  <section id="dresscode" className={`py-20 bg-[${COLORS.silverPink}] text-stone-900`}>
    <div className="container mx-auto px-6 max-w-2xl">
      {/* Headline: Old Lavender */}
      <h2 className={`text-4xl font-serif text-center mb-12 border-b-2 border-[${COLORS.mountainPink}]/50 pb-2 inline-block text-[${COLORS.oldLavender}]`}>Attire Guidance</h2>
      
      <div className="p-10 bg-white shadow-2xl rounded-xl text-center border-t-4 border-[${COLORS.mountainPink}]">
        <Heart className={`w-10 h-10 mx-auto mb-4 text-[${COLORS.mountainPink}]`} />
        <h3 className="text-3xl font-semibold font-serif mb-2">Dress Code</h3>
        <p className={`text-2xl text-[${COLORS.taupeGray}] font-medium`}>{COUPLE_INFO.dressCode.split(' ')[0]} Attire</p>
        <p className={`text-lg text-[${COLORS.taupeGray}] italic mt-1`}>({COUPLE_INFO.dressCode.substring(COUPLE_INFO.dressCode.indexOf('(') + 1, COUPLE_INFO.dressCode.indexOf(')'))}</p>
        <p className={`mt-6 text-base text-[${COLORS.taupeGray}]`}>
          We invite you to wear your finest formal wear. Please avoid colors traditionally reserved for the bride (white, ivory, or cream).
        </p>
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
        <PrenupSection />
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
  // Background: Taupe Gray
  <footer className={`bg-[${COLORS.taupeGray}] text-[${COLORS.almond}] py-10`}>
    <div className="container mx-auto px-6 text-center">
      <p className="text-lg font-serif mb-4">
        We can't wait to share our big day with you!
      </p>
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <Calendar className={`w-4 h-4 mr-2 text-[${COLORS.mountainPink}]`} />
          <span>Save the Date: {COUPLE_INFO.date}</span>
        </div>
        <div className="flex items-center">
          <Mail className={`w-4 h-4 mr-2 text-[${COLORS.mountainPink}]`} />
          <span>Contact: hello@ulyssesanddeanne.com</span>
        </div>
      </div>
      <p className={`mt-8 text-xs text-[${COLORS.silverPink}]`}>
        &copy; {new Date().getFullYear()} Ulysses & Deanne. All rights reserved.
      </p>
    </div>
  </footer>
);

export default App;