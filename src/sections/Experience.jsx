import { memo, useState, useEffect, useCallback, useRef } from "react";
import experienceData from "../data/experienceData.jsx";

function useFadeUp(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    });
    return () => cancelAnimationFrame(raf);
  }, [ref]);
}

const ExperienceCard = memo(({ exp, expIndex, isOpen, onToggle, onOpenModal, isLast }) => {
  const contentRef = useRef(null);
  const hasImages = exp.galleryImages && exp.galleryImages.length > 0;

  return (
    <div
      className="flex gap-0 relative"
      data-aos={expIndex % 2 === 0 ? "fade-right" : "fade-left"}
      data-aos-delay={expIndex * 150}
    >
      {/* Timeline Column */}
      <div className="flex flex-col items-center mr-5 flex-shrink-0 w-6 relative">
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-6 z-10 transition-all duration-300
            ${isOpen
              ? "bg-black dark:bg-white border-black dark:border-white scale-125 shadow-[0_0_0_4px_rgba(0,0,0,0.12)]"
              : "bg-white dark:bg-black border-gray-400 dark:border-gray-600"
            }`}
        />
        {!isLast && (
          <div className="w-px flex-1 mt-1 bg-gradient-to-b from-gray-400 dark:from-gray-600 to-gray-200 dark:to-gray-800 min-h-[24px]" />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 rounded-xl border-2 shadow-md overflow-hidden mb-4 transition-all duration-300
          ${isOpen
            ? "border-black dark:border-white shadow-xl"
            : "border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white hover:shadow-lg"
          }`}
      >
        {/* Header */}
        <button
          onClick={() => onToggle(expIndex)}
          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group cursor-pointer bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg shadow-md transition-all duration-300
                ${isOpen
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-100 dark:bg-white text-gray-600 dark:text-black group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black"
                }`}
            >
              <i className="bx bx-briefcase text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-black dark:text-white leading-tight truncate">{exp.title}</h3>
              {exp.company && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <i className="bx bx-buildings text-sm"></i>
                  {exp.company}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-black bg-gray-100 dark:bg-white px-3 py-1.5 rounded-full whitespace-nowrap">
              <i className="bx bx-calendar text-sm"></i>
              {exp.period}
            </span>
            <i className={`bx bx-chevron-down text-2xl text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}></i>
          </div>
        </button>

        {/* Period on mobile */}
        {!isOpen && (
          <div className="sm:hidden px-6 pb-3 -mt-2 bg-white dark:bg-black">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-black bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <i className="bx bx-calendar text-sm"></i>
              {exp.period}
            </span>
          </div>
        )}

        {/* Body */}
        <div
          ref={contentRef}
          style={{
            maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 9999}px` : "0px",
            transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}
        >
          <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-black">
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{exp.subtitle}</p>

            {exp.bullets && exp.bullets.length > 0 && (
              <ul className="space-y-2 mb-6">
                {exp.bullets.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 min-w-[6px] rounded-full bg-black dark:bg-white inline-block"></span>
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {hasImages && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <i className="bx bx-images text-base"></i>
                  Photos
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {exp.galleryImages.map((path, i) => (
                    <div
                      key={i}
                      onClick={() => onOpenModal(expIndex, i)}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 dark:border-white/5 hover:border-black dark:hover:border-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <img
                        src={path}
                        alt={`${exp.title} photo ${i + 1}`}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300">
                        <i className="bx bx-zoom-in text-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ExperienceCard.displayName = "ExperienceCard";

const Experience = memo(() => {
  const [openExpIndex, setOpenExpIndex] = useState(null);
  const [modal, setModal] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleAccordion = useCallback((index) => {
    setOpenExpIndex((prev) => (prev === index ? null : index));
  }, []);

  const openModal  = useCallback((expIndex, imgIndex) => setModal({ expIndex, imgIndex }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const navigate = useCallback(
    (direction) => {
      if (!modal) return;
      const images = experienceData[modal.expIndex].galleryImages;
      setModal((prev) => ({
        ...prev,
        imgIndex: (prev.imgIndex + direction + images.length) % images.length,
      }));
    },
    [modal]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modal) return;
      if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, navigate, closeModal]);

  useEffect(() => {
    if (!isMobile || !modal) return;
    let touchStartX = 0;
    let touchEndX = 0;
    const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
    const handleTouchMove  = (e) => { touchEndX   = e.touches[0].clientX; };
    const handleTouchEnd   = ()  => {
      if (touchStartX - touchEndX > 50) navigate(1);
      else if (touchEndX - touchStartX > 50) navigate(-1);
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove",  handleTouchMove);
    window.addEventListener("touchend",   handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove",  handleTouchMove);
      window.removeEventListener("touchend",   handleTouchEnd);
    };
  }, [isMobile, modal, navigate]);

  const activeImages = modal !== null ? experienceData[modal.expIndex].galleryImages : [];

  return (
    <section id="experience" className="bg-white dark:bg-black pb-20 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10" data-aos-delay="200" data-aos="fade-down">
          <h2 className="text-5xl font-bold text-black dark:text-white mb-2">Experience</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Click an entry to explore details</p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {experienceData.map((exp, expIndex) => (
            <ExperienceCard
              key={expIndex}
              exp={exp}
              expIndex={expIndex}
              isOpen={openExpIndex === expIndex}
              onToggle={toggleAccordion}
              onOpenModal={openModal}
              isLast={expIndex === experienceData.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {modal !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {!isMobile && activeImages.length > 1 && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-[-56px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <i className="bx bx-chevron-left text-4xl"></i>
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="absolute right-[-56px] top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <i className="bx bx-chevron-right text-4xl"></i>
                </button>
              </>
            )}

            <img
              src={activeImages[modal.imgIndex]}
              alt="Enlarged"
              className="w-full h-auto rounded-xl border-4 border-white/20 shadow-2xl"
              loading="lazy"
            />

            <div className="flex items-center justify-center gap-3 mt-4">
              {activeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setModal((prev) => ({ ...prev, imgIndex: i }))}
                  className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer
                    ${i === modal.imgIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"}`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>

            {isMobile && activeImages.length > 1 && (
              <p className="text-center text-white/50 text-xs mt-3">Swipe left or right to navigate</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
});

Experience.displayName = "Experience";

export default Experience;