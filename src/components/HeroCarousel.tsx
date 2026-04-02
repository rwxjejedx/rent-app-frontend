import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Find Your Perfect Stay",
    subtitle: "Discover thousands of properties across the Indonesian archipelago",
    bg: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&h=700&fit=crop",
    tag: "🌴 Tropical Paradise",
  },
  {
    title: "Luxury Villas & Resorts",
    subtitle: "Experience world-class hospitality at unbeatable prices",
    bg: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&h=700&fit=crop",
    tag: "✨ Premium Selection",
  },
  {
    title: "Business or Leisure",
    subtitle: "Premium accommodations for every journey and occasion",
    bg: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&h=700&fit=crop",
    tag: "🏙️ City Escapes",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative h-[55vh] min-h-[400px] overflow-hidden lg:h-[70vh]">
      {/* Background images */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={slide.bg} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,16,35,0.75) 0%, rgba(10,16,35,0.4) 60%, rgba(10,16,35,0.65) 100%)" }} />
        </div>
      ))}

      {/* Decorative grid overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div
          key={current}
          className="animate-fade-up"
        >
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest text-white/80 backdrop-blur-sm">
            {slides[current].tag}
          </span>
          <h1
            className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {slides[current].title}
          </h1>
          <p className="max-w-2xl text-base text-white/75 md:text-xl animate-fade-up-delay">
            {slides[current].subtitle}
          </p>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/20 md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2 bg-[var(--color-gold-400)]" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
