import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "./ui/Badge";

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {project.title}
            </h2>
            <p className="text-muted-foreground">{project.subtitle}</p>
          </div>
            {/* Close Button */}
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        </div>

      

        <div className="flex flex-col lg:flex-row">
          {/* Image Carousel */}
          <div className="lg:w-2/3 relative">
            <div className="relative h-96 lg:h-[500px] overflow-hidden">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain transition-transform duration-300"
              />

              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <div
                  className="absolute inset-0"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") {
                      prevImage();
                    } else if (e.key === "ArrowRight") {
                      nextImage();
                    }
                  }}
                  tabIndex={-1}
                >
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white text-black shadow-lg p-2 rounded-full cursor-pointer "
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white text-black shadow-lg p-2 rounded-full cursor-pointer "
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Image Indicators */}
              {project.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-primary scale-125"
                          : "bg-muted-foreground/50 hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {project.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border transition-all duration-200 ${
                      index === currentImageIndex
                        ? "border-primary ring-3 ring-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="lg:w-1/3 p-6 flex flex-col justify-between max-h-64 sm:max-h-none overflow-y-auto">
            <div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {project.desc}
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
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
  );
};

export default ProjectModal;
