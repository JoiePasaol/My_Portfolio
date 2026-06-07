import { memo, useState, useEffect, useCallback, useRef } from "react";
import aboutData from "../data/aboutData.jsx";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import ScrollVelocity from "../components/ScrollVelocity.jsx";


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

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/* Wrapper that applies the fade-up to a single accordion card */
const ExperienceCard = memo(({ exp, expIndex, isOpen, onToggle, onOpenModal, isLast }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  useFadeUp(cardRef);

  const hasImages = exp.galleryImages && exp.galleryImages.length > 0;

  return (
    <div
      ref={cardRef}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: `opacity 0.5s ease ${expIndex * 0.12}s, transform 0.5s ease ${expIndex * 0.12}s`,
      }}
      className="flex gap-0 relative"
    >
      {/* ── Timeline Column ── */}
      <div className="flex flex-col items-center mr-5 flex-shrink-0 w-6 relative">
        {/* Dot */}
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-6 z-10 transition-all duration-300
            ${isOpen ? "bg-black border-black scale-125 shadow-[0_0_0_4px_rgba(0,0,0,0.12)]" : "bg-white border-gray-400"}`}
        />
        {/* Vertical line */}
        {!isLast && (
          <div className="w-px flex-1 mt-1 bg-gradient-to-b from-gray-400 to-gray-200 min-h-[24px]" />
        )}
      </div>

      {/* ── Card ── */}
      <div
        className={`flex-1 rounded-xl border-2 shadow-md overflow-hidden mb-4 transition-all duration-300
          ${isOpen ? "border-black shadow-xl" : "border-gray-200 hover:border-black hover:shadow-lg"}`}
      >
        {/* Accordion Header */}
        <button
          onClick={() => onToggle(expIndex)}
          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg shadow-md transition-all duration-300
              ${isOpen ? "bg-black text-white" : "bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-white"}`}>
              <i className="bx bx-briefcase text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-black leading-tight truncate">{exp.title}</h3>
              {exp.company && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <i className="bx bx-buildings text-sm"></i>
                  {exp.company}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
              <i className="bx bx-calendar text-sm"></i>
              {exp.period}
            </span>
            <i className={`bx bx-chevron-down text-2xl text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}></i>
          </div>
        </button>

        {/* Period on mobile */}
        {!isOpen && (
          <div className="sm:hidden px-6 pb-3 -mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <i className="bx bx-calendar text-sm"></i>
              {exp.period}
            </span>
          </div>
        )}

        {/* Accordion Body */}
        <div
          ref={contentRef}
          style={{
            maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 9999}px` : "0px",
            transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}
        >
          <div className="px-6 pb-6 pt-2 border-t border-gray-100">
            <p className="text-gray-700 mb-4 leading-relaxed">{exp.subtitle}</p>

            {exp.bullets && exp.bullets.length > 0 && (
              <ul className="space-y-2 mb-6">
                {exp.bullets.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 min-w-[6px] rounded-full bg-black inline-block"></span>
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {hasImages && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <i className="bx bx-images text-base"></i>
                  Photos
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {exp.galleryImages.map((path, i) => (
                    <div
                      key={i}
                      onClick={() => onOpenModal(expIndex, i)}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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

const About = memo(() => {
  const resumeButtonClasses = `inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
    bg-transparent border-2 border-black text-black hover:text-white hover:bg-black cursor-pointer`;

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

  const openModal = useCallback((expIndex, imgIndex) => {
    setModal({ expIndex, imgIndex });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const navigate = useCallback(
    (direction) => {
      if (!modal) return;
      const images = aboutData.experience[modal.expIndex].galleryImages;
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
    const handleTouchMove = (e) => { touchEndX = e.touches[0].clientX; };
    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) navigate(1);
      else if (touchEndX - touchStartX > 50) navigate(-1);
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, modal, navigate]);

  const activeImages =
    modal !== null ? aboutData.experience[modal.expIndex].galleryImages : [];

  return (
    <section id="about" className="min-h-screen bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <header className="mb-12">
          <ScrollVelocity
            texts={[
              <>
                <span className="text-transparent" style={{ WebkitTextStroke: "1px black" }}>About</span>
                <span className="text-black"> Me</span>
              </>,
              <>
                <span className="text-transparent" style={{ WebkitTextStroke: "1px black" }}>About</span>
                <span className="text-black"> Me</span>
              </>,
            ]}
            velocity={40}
            className="text-4xl md:text-6xl font-bold"
          />
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[calc(100vh-5rem)] md:px-12">
          {/* Profile Image */}
          <div
            className="w-full flex justify-center lg:justify-start"
            data-aos="fade-right"
            data-aos-delay="600"
            data-aos-once="true"
          >
            <img
              src={aboutData.image}
              alt="About Me"
              className="w-full max-w-md rounded-xl shadow-lg object-cover border-8 border-black hover:shadow-3xl hover:-translate-y-2 transition-all duration-300"
            />
          </div>

          {/* Biodata Section */}
          <div className="w-full text-gray-800 dark:text-white pl-4">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
              data-aos="fade-down"
              data-aos-delay="600"
              data-aos-once="true"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 p-4 flex items-center justify-center rounded-lg shadow-lg bg-black text-white">
                    <i className={`bx ${aboutData.aboutNarrative.whoAmI.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-black">Who Am I</h3>
                </div>
                <p className="text-black">{aboutData.aboutNarrative.whoAmI.text}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 p-4 flex items-center justify-center rounded-lg shadow-lg bg-black text-white">
                    <i className={`bx ${aboutData.aboutNarrative.approach.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-black">My Approach</h3>
                </div>
                <p className="text-black">{aboutData.aboutNarrative.approach.text}</p>
              </div>
            </div>

            <div
              className="flex items-center gap-2 mb-4"
              data-aos="fade-down"
              data-aos-delay="600"
              data-aos-once="true"
            >
              <i className="bx bx-info-circle text-2xl text-black" aria-hidden="true"></i>
              <h2 className="text-2xl font-semibold text-black">Personal Info</h2>
            </div>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto lg:mx-0"
              data-aos="fade-down"
              data-aos-delay="600"
              data-aos-once="true"
            >
              {aboutData.biodata.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 p-4 rounded-lg bg-black shadow-lg text-white">
                    <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-black">{item.label}:</span>
                    <span className="text-sm text-gray-800"> {item.value}</span>
                  </div>
                </li>
              ))}
            </ul>

            <Tippy content="Download My CV">
              {aboutData.resume.href ? (
                <a
                  href={aboutData.resume.href}
                  download={aboutData.resume.download ? true : undefined}
                  className={resumeButtonClasses}
                  aria-label="Download CV"
                  data-aos="fade-down"
                  data-aos-delay="600"
                  data-aos-once="true"
                  style={{ transition: "all 300ms ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "black"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "black"; }}
                >
                  <i className={`${aboutData.resume.icon} text-lg mr-2`} aria-hidden="true" />
                  {aboutData.resume.label}
                </a>
              ) : (
                <button
                  onClick={() => Swal.fire({ title: "Not Available Yet 😅", text: "My resume is still in progress. Please check back later!", icon: "info", confirmButtonColor: "#1F2937", confirmButtonText: "Alright" })}
                  className={resumeButtonClasses}
                  aria-label="Download CV"
                  data-aos="fade-down"
                  data-aos-delay="600"
                  data-aos-once="true"
                  style={{ transition: "all 300ms ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "black"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "black"; }}
                >
                  <i className={`${aboutData.resume.icon} text-lg mr-2`} aria-hidden="true" />
                  {aboutData.resume.label}
                </button>
              )}
            </Tippy>
          </div>
        </div>

        {/* ── Experience Section ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-20">
          <div
            className="text-center mb-10"
            data-aos="fade-down"
            data-aos-delay="200"
            data-aos-once="true"
          >
            <h2 className="text-5xl font-bold text-black mb-2">Experience</h2>
            <p className="text-gray-500 text-sm mt-2">Click an entry to explore details</p>
          </div>

          {/* Timeline + Accordion */}
          <div className="flex flex-col">
            {aboutData.experience.map((exp, expIndex) => (
              <ExperienceCard
                key={expIndex}
                exp={exp}
                expIndex={expIndex}
                isOpen={openExpIndex === expIndex}
                onToggle={toggleAccordion}
                onOpenModal={openModal}
                isLast={expIndex === aboutData.experience.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      {modal !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
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

About.displayName = "About";

export default About;