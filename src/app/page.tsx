'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Compass, Users, Check, Map, IndianRupee, Home, Shield, ArrowDown, MapPin, Zap, Heart, Star, Briefcase, GraduationCap, ChevronRight, TrendingUp } from 'lucide-react';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import TripCard from '@/components/trips/TripCard';
import TripFilter from '@/components/trips/TripFilter';
import DestinationCard from '@/components/destinations/DestinationCard';

import { FEATURED_TRIPS, COMMUNITY_TRIPS, TRIP_CATEGORIES } from '@/lib/data/trips';
import { FEATURED_DESTINATIONS, DESTINATION_CATEGORIES } from '@/lib/data/destinations';
import { formatPrice, cn } from '@/lib/utils/format';

// --- Utility Components for Animation ---

const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }
    }
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({ from = 0, to, duration = 2, prefix = '', suffix = '' }: any) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing out quint
      const easeProgress = 1 - Math.pow(1 - progress, 5);
      
      setCount(Math.floor(easeProgress * (to - from) + from));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// --- Page Component ---

export default function HomePage() {
  const [activeTripCategory, setActiveTripCategory] = useState('all');
  const [activeDestCategory, setActiveDestCategory] = useState('all');
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);

  const filteredTrips = activeTripCategory === 'all' 
    ? FEATURED_TRIPS 
    : FEATURED_TRIPS.filter(trip => trip.trip_type.toLowerCase() === activeTripCategory.toLowerCase() || trip.tags.some(t => t.toLowerCase() === activeTripCategory.toLowerCase()));

  const filteredDestinations = activeDestCategory === 'all'
    ? FEATURED_DESTINATIONS
    : FEATURED_DESTINATIONS.filter(dest => dest.category.some(c => c.toLowerCase() === activeDestCategory.toLowerCase()));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-brand-navy flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="/spiti.jpg"
            alt="Spiti Valley"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/40 to-brand-navy" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 backdrop-blur-md mb-6 text-brand-orange font-bold text-xs tracking-widest uppercase"
          >
            STUDENT TRAVEL IN INDIA
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-outfit text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-brand-cream leading-[1.1] mb-6"
          >
            Travel Like a Local.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-gold">
              Not Like a Tourist.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-brand-cream/80 max-w-2xl mx-auto mb-10 font-nunito"
          >
            Student-first trips, real local experiences, and a community that travels together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/trips"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-orange hover:bg-[#d16122] text-white font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(227,111,44,0.3)] hover:shadow-[0_0_30px_rgba(227,111,44,0.5)] transform hover:-translate-y-1"
            >
              Explore Trips
            </Link>
            <Link 
              href="/build-your-trip"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-brand-cream/30 hover:border-brand-cream text-brand-cream bg-white/5 backdrop-blur-sm font-bold text-lg transition-all duration-300 hover:bg-white/10"
            >
              Build My Trip
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6"
          >
            <Link href="/college-trips" className="text-brand-cream/60 hover:text-brand-cream text-sm uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2">
              Plan a College Trip <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Floating UI Cards */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="hidden lg:flex absolute bottom-24 left-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 items-center gap-4 text-brand-cream z-20"
        >
          <div className="p-3 bg-brand-orange rounded-xl">
            <Compass size={24} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-brand-cream/70 font-semibold uppercase tracking-wider">Starting from</p>
            <p className="font-outfit font-bold text-xl">₹4,999 onwards</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="hidden lg:flex absolute bottom-40 right-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 items-center gap-4 text-brand-cream z-20"
        >
          <div className="p-3 bg-brand-gold rounded-xl text-brand-navy">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-brand-cream/70 font-semibold uppercase tracking-wider">Active Group</p>
            <p className="font-outfit font-bold text-xl">12 travelers going</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="hidden lg:flex absolute top-32 right-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 items-center gap-4 text-brand-cream z-20"
        >
          <div className="p-3 bg-green-500 rounded-xl text-white">
            <Check size={24} />
          </div>
          <div>
            <p className="text-xs text-brand-cream/70 font-semibold uppercase tracking-wider">Milestone</p>
            <p className="font-outfit font-bold text-xl">7+ trips done</p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-brand-cream/60"
        >
          <span className="text-xs tracking-widest uppercase font-semibold">Scroll</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* 3. FEATURED TRIPS SECTION */}
      <section className="py-24 bg-brand-cream text-brand-navy relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-4xl md:text-5xl font-black mb-4">Find Your Next Adventure</h2>
            <p className="text-lg text-brand-navy/70">
              Upcoming trips built for students and young travelers. Real experiences, budget-friendly prices.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="mb-12">
            <TripFilter 
              categories={TRIP_CATEGORIES} 
              selected={activeTripCategory} 
              onSelect={setActiveTripCategory} 
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredTrips.slice(0, 6).map((trip, idx) => (
              <FadeIn key={trip.id} delay={0.1 * (idx % 3)}>
                <TripCard trip={trip} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center">
            <Link 
              href="/trips"
              className="inline-flex items-center gap-2 text-brand-orange font-bold text-lg group"
            >
              View All Trips 
              <ArrowDown className="transform -rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 4. 'STUDENT TRAVEL IS BROKEN' SECTION */}
      <section className="py-24 bg-brand-navy text-brand-cream relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-black text-brand-cream">
              Student Travel Shouldn't Feel Like a Package.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
            {[
              { title: "Fixed Itineraries", desc: "Little flexibility once a package is booked.", icon: Map },
              { title: "Not Student-Priced", desc: "Travel packages weren't designed for campus budgets.", icon: IndianRupee },
              { title: "Generic Experiences", desc: "Tourist-trap circuits instead of real destinations.", icon: Star },
              { title: "Zero Personalization", desc: "One itinerary sold to everyone.", icon: Heart },
              { title: "Hard to Organize", desc: "College groups struggle to coordinate reliable trips.", icon: Users },
            ].map((problem, idx) => (
              <FadeIn 
                key={idx} 
                delay={idx * 0.1}
                className={cn(
                  "bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group",
                  idx === 3 && "lg:col-start-1 lg:col-end-2 lg:ml-auto lg:w-full",
                  idx === 4 && "lg:col-start-2 lg:col-end-4 lg:w-[calc(50%-12px)] lg:mr-auto" // custom placing for 5 items
                )}
              >
                <div className="text-brand-orange/60 group-hover:text-brand-orange transition-colors mb-4">
                  <problem.icon size={32} />
                </div>
                <h3 className="font-outfit text-xl font-bold mb-3">{problem.title}</h3>
                <p className="text-brand-cream/60 leading-relaxed">{problem.desc}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6} className="text-center flex flex-col items-center">
            <p className="text-2xl md:text-3xl font-outfit font-bold text-brand-orange mb-6">
              So We Built Travel Tribe.
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-brand-orange"
            >
              <ArrowDown size={32} />
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* 5. OUR SOLUTION SECTION */}
      <section className="py-24 bg-brand-cream text-brand-navy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="font-outfit text-4xl md:text-5xl font-black mb-4">One Platform. Every Trip.</h2>
            <p className="text-lg text-brand-navy/70 max-w-2xl mx-auto">
              Everything you need to plan, coordinate, and experience the perfect student trip.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: MapPin, title: "Customize Your Itinerary", desc: "Build a trip that matches your group's exact vibe and preferences." },
              { icon: IndianRupee, title: "Student-Friendly Budgets", desc: "Premium experiences optimized for the college pocket." },
              { icon: Home, title: "Experience Like Locals", desc: "Skip the tourist traps. Connect deeply with the destination." },
              { icon: Users, title: "Curated Community Trips", desc: "Join scheduled departures and meet like-minded travelers." },
              { icon: Shield, title: "End-to-End Management", desc: "From transport to stays, we handle the logistics so you don't have to." },
            ].map((feature, idx) => (
              <FadeIn 
                key={idx} 
                delay={idx * 0.1}
                className="bg-white p-8 rounded-2xl shadow-sm border border-brand-navy/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-6 text-brand-orange">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-outfit text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-brand-navy/70">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BUILD YOUR TRIP CTA STRIP */}
      <section className="py-20 bg-gradient-to-r from-brand-orange to-[#d16122] text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <FadeIn className="max-w-2xl text-center lg:text-left">
              <h2 className="font-outfit text-4xl md:text-5xl font-black mb-4">Your Trip. Your Rules.</h2>
              <p className="text-xl text-white/90">Tell us what you want. We build it around you.</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-6">
                <span className="flex items-center gap-2 text-white/80 font-semibold"><Zap size={18} /> Takes 2 minutes</span>
                <span className="flex items-center gap-2 text-white/80 font-semibold"><IndianRupee size={18} /> 100% free</span>
                <span className="flex items-center gap-2 text-white/80 font-semibold"><Heart size={18} /> Personalized</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} direction="left">
              <Link 
                href="/build-your-trip"
                className="inline-flex items-center justify-center px-10 py-5 bg-brand-navy text-white rounded-xl font-bold text-xl hover:bg-brand-navy/90 transition-all hover:shadow-[0_0_20px_rgba(27,58,66,0.3)] transform hover:-translate-y-1"
              >
                Build My Trip <ChevronRight className="ml-2" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY TRIPS */}
      <section className="py-24 bg-brand-cream overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <FadeIn className="max-w-2xl">
              <h2 className="font-outfit text-4xl md:text-5xl font-black text-brand-navy mb-4">Don't Just Visit. Belong Somewhere.</h2>
              <p className="text-lg text-brand-navy/70">Join upcoming community trips with like-minded travelers.</p>
            </FadeIn>
            <FadeIn delay={0.2} className="shrink-0">
              <Link 
                href="/community"
                className="text-brand-orange font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                See All Community Trips <ChevronRight size={20} />
              </Link>
            </FadeIn>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x hide-scrollbar gap-6">
            {COMMUNITY_TRIPS.map((trip, idx) => (
              <FadeIn key={trip.id} delay={idx * 0.1} className="w-[85vw] sm:w-[400px] shrink-0 snap-start">
                <TripCard trip={trip} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DESTINATIONS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-outfit text-4xl md:text-5xl font-black text-brand-navy mb-4">Explore India Your Way</h2>
            </FadeIn>
            
            <FadeIn delay={0.2} className="mt-8">
              <div className="flex flex-wrap justify-center gap-3">
                {DESTINATION_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveDestCategory(cat.id)}
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-1.5",
                      activeDestCategory === cat.id 
                        ? "bg-brand-navy border-brand-navy text-white" 
                        : "bg-white border-brand-navy/20 text-brand-navy hover:border-brand-navy"
                    )}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDestinations.slice(0, 6).map((dest, idx) => (
              <FadeIn key={dest.id} delay={0.1 * (idx % 3)}>
                <DestinationCard destination={dest} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center">
            <Link 
              href="/destinations"
              className="inline-flex px-8 py-3 rounded-xl border-2 border-brand-navy text-brand-navy font-bold hover:bg-brand-navy hover:text-white transition-colors"
            >
              Explore All Destinations
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 9. TRACTION / SOCIAL PROOF */}
      <section className="py-24 bg-brand-navy text-brand-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-4xl md:text-5xl font-black mb-4">We've Already Been Doing It.</h2>
            <p className="text-xl text-brand-cream/70">Real revenue. Real travelers. Real trips.</p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: "PAYING CUSTOMERS", value: 200, suffix: "+", icon: Users },
              { label: "SUCCESSFUL TRIPS", value: 7, suffix: "+", icon: Map },
              { label: "REVENUE", value: 5, prefix: "₹", suffix: "L+", icon: TrendingUp },
              { label: "PROFIT", value: 90, prefix: "₹", suffix: "K+", icon: IndianRupee },
            ].map((stat, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <stat.icon className="mx-auto mb-4 text-brand-orange" size={32} />
                <h3 className="font-outfit text-4xl md:text-5xl font-black text-brand-orange mb-2">
                  <AnimatedCounter from={0} to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </h3>
                <p className="text-sm tracking-widest uppercase font-bold text-brand-cream/70">{stat.label}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="bg-gradient-to-r from-brand-orange/20 to-transparent border-l-4 border-brand-orange p-6 sm:p-8 rounded-r-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0 text-brand-orange">
              <Users size={48} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-brand-cream/50 mb-2">Scale Milestone</p>
              <h4 className="font-outfit text-2xl font-bold mb-2">Largest Group: 58 Travelers</h4>
              <p className="text-brand-cream/80">Successfully organized and executed a trip for 52 MBA students and 6 faculty members.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 10. COLLEGE TRIPS CTA */}
      <section className="py-24 bg-brand-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-brand-navy/10 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-10 sm:p-14 lg:p-20 flex flex-col justify-center">
                <FadeIn>
                  <h2 className="font-outfit text-4xl md:text-5xl font-black text-brand-navy mb-6">Planning a College Trip?</h2>
                  <p className="text-lg text-brand-navy/70 mb-10 leading-relaxed">
                    We've organized trips for MBA batches, BBA groups, and college societies across India. Stop stressing over logistics and let us handle everything from transport to stays.
                  </p>
                  <Link 
                    href="/college-trips"
                    className="inline-flex w-fit items-center justify-center px-8 py-4 bg-brand-navy text-white rounded-xl font-bold text-lg hover:bg-brand-navy/90 transition-all"
                  >
                    Get a Group Quote <ChevronRight className="ml-2" />
                  </Link>
                </FadeIn>
              </div>
              <div className="lg:w-1/2 bg-brand-navy relative min-h-[400px] flex items-center justify-center p-10">
                <div className="absolute inset-0 opacity-40">
                  {/* Subtle pattern or image here */}
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                </div>
                
                <FadeIn delay={0.2} className="relative z-10 max-w-sm w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center text-brand-cream shadow-2xl">
                  <GraduationCap className="mx-auto mb-6 text-brand-orange" size={48} />
                  <h3 className="font-outfit text-2xl font-bold mb-4">Trusted by Campuses</h3>
                  <p className="text-brand-cream/80 mb-6">"Our largest execution involved flawlessly coordinating 58 travelers in a single batch."</p>
                  <div className="text-sm font-bold uppercase tracking-wider text-brand-orange">
                    52 MBA Students + 6 Faculty
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOUNDER STORY */}
      <section className="py-24 bg-[#FDFBF7] relative border-t border-brand-navy/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-brand-navy mb-4">We Don't Just Plan Trips. We Travel Them.</h2>
            <p className="text-xl text-brand-navy/70">Founders in the field, not just the deck.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1} className="bg-white rounded-2xl p-8 shadow-sm border border-brand-navy/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-full bg-brand-navy/10 shrink-0 flex items-center justify-center text-brand-navy">
                <Briefcase size={32} />
              </div>
              <div>
                <h3 className="font-outfit text-2xl font-bold text-brand-navy mb-1">Jay Yadav</h3>
                <p className="text-brand-orange font-bold text-sm mb-4 uppercase tracking-wider">Trip Captain · Operations · Community</p>
                <p className="text-brand-navy/70 text-sm font-semibold">BBA Tourism & Travel Management (IITTM Gwalior)<br/>BBA Digital Business & Entrepreneurship (IIM Bangalore)</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="bg-white rounded-2xl p-8 shadow-sm border border-brand-navy/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-full bg-brand-navy/10 shrink-0 flex items-center justify-center text-brand-navy">
                <Briefcase size={32} />
              </div>
              <div>
                <h3 className="font-outfit text-2xl font-bold text-brand-navy mb-1">Yug Verma</h3>
                <p className="text-brand-orange font-bold text-sm mb-4 uppercase tracking-wider">Business Development · Operations</p>
                <p className="text-brand-navy/70 text-sm font-semibold">BBA Digital Business & Entrepreneurship (IIM Bangalore)</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 12. WHY TRAVEL TRIBE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-brand-navy">Why Travel Tribe?</h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Tourism Education Background",
              "Real Execution Experience",
              "Student Community Access",
              "Proven Revenue",
              "Proven Demand",
              "Strong Industry Network"
            ].map((reason, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="bg-brand-cream p-6 rounded-xl text-center border border-brand-navy/5 flex flex-col items-center justify-center min-h-[120px]">
                <Check className="text-brand-orange mb-3" size={24} />
                <h3 className="font-bold text-brand-navy">{reason}</h3>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="relative py-32 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy z-10" />
          <Image
            src="/spiti.jpg"
            alt="Adventure awaits"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <FadeIn>
            <h2 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-black text-brand-cream mb-6">
              Your next trip is waiting.
            </h2>
            <p className="text-xl md:text-2xl text-brand-cream/80 mb-12 max-w-3xl mx-auto">
              Stop travelling like a tourist. Start travelling with your tribe.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/trips"
                className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white rounded-xl font-bold hover:bg-[#d16122] transition-colors"
              >
                EXPLORE TRIPS
              </Link>
              <Link 
                href="/build-your-trip"
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-navy rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                BUILD MY TRIP
              </Link>
              <Link 
                href="/college-trips"
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                PLAN A COLLEGE TRIP
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
