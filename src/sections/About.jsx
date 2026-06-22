import { memo, useEffect, useState } from "react";
import aboutData from "../data/aboutData.jsx";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import ScrollVelocity from "../components/ScrollVelocity.jsx";

const About = memo(() => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const strokeColor = isDark ? "1px white" : "1px black";

  const resumeButtonClasses = `inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
    bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white cursor-pointer`;

  return (
    <section id="about" className="min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <header className="mb-12">
          <ScrollVelocity
            texts={[
              <>
                <span className="text-transparent" style={{ WebkitTextStroke: strokeColor }}>About</span>
                <span className="text-black dark:text-white"> Me</span>
              </>,
              <>
                <span className="text-transparent" style={{ WebkitTextStroke: strokeColor }}>About</span>
                <span className="text-black dark:text-white"> Me</span>
              </>,
            ]}
            velocity={40}
            className="text-4xl md:text-6xl font-bold"
          />
        </header>

        {/* Shared AOS anchor */}
        <div id="about-anchor" />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[calc(100vh-5rem)] md:px-12">

          {/* Profile Image */}
          <div
            className="w-full flex justify-center lg:justify-start"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-anchor="#about-anchor"
          >
            <img
              src={aboutData.image}
              alt="About Me"
              className="w-full max-w-md rounded-xl shadow-lg object-cover border-8 border-black dark:border-white hover:shadow-3xl hover:-translate-y-2 transition-all duration-300"
            />
          </div>

          {/* Biodata Section */}
          <div className="w-full text-gray-800 dark:text-gray-200 pl-4">

            {/* Who Am I + My Approach */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-anchor="#about-anchor"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 p-4 flex items-center justify-center rounded-lg shadow-lg bg-black dark:bg-white text-white dark:text-black">
                    <i className={`bx ${aboutData.aboutNarrative.whoAmI.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">Who Am I</h3>
                </div>
                <p className="text-black dark:text-gray-300">{aboutData.aboutNarrative.whoAmI.text}</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 p-4 flex items-center justify-center rounded-lg shadow-lg bg-black dark:bg-white text-white dark:text-black">
                    <i className={`bx ${aboutData.aboutNarrative.approach.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white">My Approach</h3>
                </div>
                <p className="text-black dark:text-gray-300">{aboutData.aboutNarrative.approach.text}</p>
              </div>
            </div>

            {/* Personal Info */}
            <div
              className="flex items-center gap-2 mb-4"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-anchor="#about-anchor"
            >
              <i className="bx bx-info-circle text-2xl text-black dark:text-white" aria-hidden="true"></i>
              <h2 className="text-2xl font-semibold text-black dark:text-white">Personal Info</h2>
            </div>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto lg:mx-0"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-anchor="#about-anchor"
            >
              {aboutData.biodata.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 p-4 rounded-lg bg-black dark:bg-white shadow-lg text-white dark:text-black">
                    <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-black dark:text-white">{item.label}:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-300"> {item.value}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resume Button */}
            <Tippy content="Download My CV">
              {aboutData.resume.href ? (
                
                  href={aboutData.resume.href}
                  download={aboutData.resume.download ? true : undefined}
                  className={resumeButtonClasses}
                  aria-label="Download CV"
                  data-aos="fade-up"
                  data-aos-delay="700"
                  data-aos-anchor="#about-anchor"
                  style={{ transition: "all 300ms ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
                  onMouseOut={(e) =>  { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
                >
                  <i className={`${aboutData.resume.icon} text-lg mr-2`} aria-hidden="true" />
                  {aboutData.resume.label}
                </a>
              ) : (
                <button
                  onClick={() => Swal.fire({
                    title: "Not Available Yet 😅",
                    text: "My resume is still in progress. Please check back later!",
                    icon: "info",
                    confirmButtonColor: "#1F2937",
                    confirmButtonText: "Alright",
                  })}
                  className={resumeButtonClasses}
                  aria-label="Download CV"
                  data-aos="fade-up"
                  data-aos-delay="700"
                  data-aos-anchor="#about-anchor"
                  style={{ transition: "all 300ms ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
                  onMouseOut={(e) =>  { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
                >
                  <i className={`${aboutData.resume.icon} text-lg mr-2`} aria-hidden="true" />
                  {aboutData.resume.label}
                </button>
              )}
            </Tippy>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;
