import { useState, useEffect, memo, useMemo } from "react";
import homeData from "../data/homeData.jsx";
import Tippy from '@tippyjs/react';
import { lazy, Suspense } from 'react';

// Lazy load the Lanyard component as it's heavy with 3D graphics
const Lanyard = lazy(() => import('../components/Lanyard.jsx'));

const Home = memo(() => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const titles = useMemo(() => homeData.typingTexts, []);

  useEffect(() => {
    const currentTitle = titles[currentIndex];

    const typeSpeed = isDeleting ? 100 : 150;
    const pauseTime = isDeleting ? 500 : 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentTitle.length) {
          setCurrentText(currentTitle.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % titles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, titles]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen bg-white dark:bg-black pt-18 overflow-hidden transition-colors duration-300"
      data-aos-duration="1000"
      data-aos="fade-down"
    >
      <div className="hidden md:block absolute w-full">
        <Suspense fallback={<div className="w-full h-screen" />}>
          <Lanyard position={[0, 0, 14]} gravity={[0, -40, 0]} />
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)] py-12">
          <div className="space-y-8 px-4">

            <div className="space-y-4">
              <h1
                className="text-4xl sm:text-5xl lg:text-5xl font-bold text-black dark:text-white"
                data-aos-delay="600"
                data-aos="fade-down"
              >
                {homeData.title}
              </h1>

              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black dark:text-gray-200 flex items-center"
                data-aos-delay="600"
                data-aos="fade-right"
              >
                <span className="typing-text">
                  {currentText}
                  <span
                    className={`cursor ${showCursor ? "opacity-100" : "opacity-0"} transition-all duration-200`}
                  >
                    |
                  </span>
                </span>
              </h2>
            </div>

            <p
              className="text-lg text-black dark:text-gray-300 leading-relaxed max-w-lg"
              data-aos-delay="600"
              data-aos="fade-left"
            >
              {homeData.description}
            </p>

            {/* Social Links */}
            <div
              className="flex items-center space-x-4"
              data-aos-delay="600"
              data-aos="fade-down"
            >
              <span className="text-black dark:text-gray-300 font-medium">
                Connect me on:
              </span>
              <div className="flex space-x-3">
                {homeData.socialMedia.map((social, index) => (
                  <Tippy content={social.platform} key={index} placement="top">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center shadow-2xl justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:hover:bg-gray-200"
                      aria-label={`Visit ${social.platform}`}
                    >
                      <i className={`${social.icon} text-lg`}></i>
                    </a>
                  </Tippy>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              data-aos-delay="600"
              data-aos="fade-down"
            >
              {homeData.buttons.map((btn, index) => (
                <Tippy content={btn.label} key={index} placement="top">
                  {btn.href && btn.href !== "#" && (
                    <a
                      href={btn.href}
                      download={btn.download ? true : undefined}
                      className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:-translate-y-1
                        ${btn.type === "primary"
                          ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-xl"
                          : "border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:shadow-xl"
                        }`}
                      target={btn.href.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      <i className={`bx ${btn.type === "primary" ? "bx-download" : "bx-envelope"} mr-2`} />
                      {btn.label}
                    </a>
                  )}
                </Tippy>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
});

Home.displayName = 'Home';

export default Home;