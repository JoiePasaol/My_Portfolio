import { useState, useEffect } from "react";
import homeData from "../data/homeData.jsx";
import Tippy from '@tippyjs/react';
import Swal from 'sweetalert2';
import Lanyard from '../components/Lanyard.jsx';

const Home = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const titles = homeData.typingTexts;
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
  }, [currentText, currentIndex, isDeleting]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen bg-white pt-18 overflow-hidden" data-aos-duration="1000" data-aos="fade-down"
    >
      <div className="hidden md:block absolute w-full">
      <Lanyard position={[0, 0, 14]} gravity={[0, -40, 0]} />
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)] py-12">
          <div className="space-y-8 px-4">
            <div className="space-y-4 ">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-black  " data-aos-dely="600" data-aos="fade-down">
                {homeData.title}
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black flex items-center" data-aos-delay="600" data-aos="fade-right">
                <span className="typing-text">
                  {currentText}
                  <span
                    className={`cursor ${showCursor ? "opacity-100" : "opacity-0"
                      } transition-all duration-200`}
                  >
                    
                  </span>
                </span>
              </h2>
            </div>


            <p className="text-lg text-black leading-relaxed max-w-lg" data-aos-delay="600" data-aos="fade-left">
              {homeData.description}
            </p>

            <div className="flex items-center space-x-4" data-aos-delay="600" data-aos="fade-down">
              <span className="text-black font-medium">
                Connect me on:
              </span>
              <div className="flex space-x-3">
                {homeData.socialMedia.map((social, index) => (
                  <Tippy content={social.platform} key={index} placement="top">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-black text-white  rounded-full flex items-center shadow-2xl justify-center  transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      aria-label={`Visit ${social.platform}`}
                    >
                      <i className={`${social.icon} text-lg`}></i>
                    </a>
                  </Tippy>
                ))}
              </div>

            </div>


            <div className="flex flex-col sm:flex-row gap-4" data-aos-delay="600" data-aos="fade-down">
              {homeData.buttons.map((btn, index) => (
                <Tippy content={btn.label} key={index} placement="top">
               {btn.href && btn.href !== "#" && (
  <a
    href={btn.href}
    download={btn.download ? true : undefined}
    className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:text-white hover:bg-black hover:shadow-xl hover:-translate-y-1 ${btn.type === "primary"
      ? "bg-black text-white "
      : "border-2 border-black  text-black "
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

        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
          .dark .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
          }
          .typing-text {
            display: inline-block;
          }
          .cursor {
            font-weight: 600;
            color: #1f2937;
          }
          .dark .cursor {
            color: #d1d5db;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Home;
