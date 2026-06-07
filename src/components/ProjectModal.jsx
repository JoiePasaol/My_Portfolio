import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "./ui/Badge";

const ProjectModal = memo(({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  }, [project.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  }, [project.images.length]);

  const goToImage = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  const currentImage = useMemo(
    () => project.images[currentImageIndex],
    [project.images, currentImageIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prevImage, nextImage]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col border border-transparent dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {project.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{project.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Image Carousel */}
          <div className="lg:w-2/3 relative flex flex-col">
            <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[400px] overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-white/5">
              <img
                src={currentImage}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain transition-transform duration-300"
                loading="lazy"
              />

              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <div className="absolute inset-0">
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-black/70 text-black dark:text-white border border-transparent dark:border-white/20 shadow-lg p-2 rounded-full cursor-pointer transition-colors duration-200"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-black/70 text-black dark:text-white border border-transparent dark:border-white/20 shadow-lg p-2 rounded-full cursor-pointer transition-colors duration-200"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              )}

            </div>

            {/* Thumbnails */}
            {project.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto flex-shrink-0 border-t border-gray-100 dark:border-white/5">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      index === currentImageIndex
                        ? "border-black dark:border-white ring-2 ring-black dark:ring-white"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="lg:w-1/3 flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-3">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectModal.displayName = "ProjectModal";

export default ProjectModal;