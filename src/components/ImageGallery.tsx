import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Expand, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const goToImage = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setShowGrid(false);
    setIsZoomed(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      else if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "g") setShowGrid((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToNext, goToPrev]);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden group cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-card"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-card"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </button>
          </>
        )}

        {/* Expand Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          className="absolute bottom-4 right-4 px-4 py-2.5 rounded-lg bg-card/90 backdrop-blur-sm shadow-lg flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card hover:scale-105"
        >
          <Expand className="h-4 w-4" />
          View All Photos ({images.length})
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && images.length <= 8 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  idx === currentIndex 
                    ? "bg-primary w-6" 
                    : "bg-card/80 hover:bg-card"
                )}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 group/thumb",
                idx === currentIndex 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
              />
              {idx === 3 && images.length > 4 && (
                <div 
                  className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); setShowGrid(true); }}
                >
                  <span className="text-lg font-semibold text-foreground">+{images.length - 4}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-background/95 backdrop-blur-xl border-none">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground/80">
                  {currentIndex + 1} of {images.length}
                </span>
                <h3 className="text-lg font-semibold text-foreground truncate max-w-md">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showGrid ? "bg-primary text-primary-foreground" : "bg-card/80 hover:bg-card text-foreground"
                  )}
                  aria-label="Toggle grid view"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="p-2 rounded-lg bg-card/80 hover:bg-card transition-colors text-foreground"
                  aria-label="Close lightbox"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {showGrid ? (
              /* Grid View */
              <div className="flex-1 overflow-y-auto pt-16 pb-4 px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 group/grid",
                        idx === currentIndex 
                          ? "border-primary ring-2 ring-primary/30" 
                          : "border-transparent hover:border-primary/50"
                      )}
                    >
                      <img
                        src={img}
                        alt={`${title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/grid:scale-105"
                      />
                      <div className="absolute inset-0 bg-background/0 group-hover/grid:bg-background/20 transition-colors duration-300" />
                      <span className="absolute bottom-2 left-2 text-xs font-medium text-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Single Image View */
              <div className="flex-1 flex items-center justify-center pt-16 pb-24 px-4">
                <div 
                  className={cn(
                    "relative max-w-full max-h-full transition-transform duration-300",
                    isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
                  )}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={images[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl animate-fade-in"
                    key={currentIndex}
                  />
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-card"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-7 w-7 text-foreground" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-card"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-7 w-7 text-foreground" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Bottom Thumbnails */}
            {!showGrid && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <div className="flex gap-2 justify-center overflow-x-auto py-2 px-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={cn(
                        "flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all duration-300",
                        idx === currentIndex 
                          ? "border-primary ring-2 ring-primary/30 scale-110" 
                          : "border-transparent opacity-50 hover:opacity-100 hover:border-muted-foreground/30"
                      )}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Use arrow keys to navigate • Press G for grid view • Click image to zoom
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
