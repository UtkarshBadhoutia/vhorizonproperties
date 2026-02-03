import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1920",
    alt: "Luxury modern villa with pool",
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1920",
    alt: "Contemporary mansion exterior",
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920",
    alt: "Premium penthouse view",
  },
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1920",
    alt: "Elegant interior living space",
  },
];

interface HeroCarouselProps {
  children: React.ReactNode;
}

export default function HeroCarousel({ children }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);

    // Auto-play every 5 seconds
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi, onSelect]);

  return (
    <header className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center transition-transform duration-[8s] ease-out",
                  selectedIndex === index && "scale-110"
                )}
                style={{ backgroundImage: `url('${image.url}')` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        {children}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-6 sm:w-8 bg-primary"
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-6">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>
    </header>
  );
}
