import { memo } from "react";
import aboutData from "../data/aboutData.jsx";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import ScrollVelocity from "../components/ScrollVelocity.jsx";

const About = memo(() => {
  const resumeButtonClasses = `inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
    bg-transparent border-2 border-black text-black hover:text-white hover:bg-black cursor-pointer`;

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
          >
            <img
              src={aboutData.image}
              alt="About Me"
              className="w-full max-w-md rounded-xl shadow-lg object-cover border-8 border-black hover:shadow-3xl hover:-translate-y-2 transition-all duration-300"
            />
          </div>

          {/* Biodata Section */}
          <div className="w-full text-gray-800 pl-4">

            {/* Who Am I + My Approach */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
              data-aos-delay="600"
              data-aos="fade-down"
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

            {/* Personal Info */}
            <div
              className="flex items-center gap-2 mb-4"
              data-aos-delay="600"
              data-aos="fade-down"
            >
              <i className="bx bx-info-circle text-2xl text-black" aria-hidden="true"></i>
              <h2 className="text-2xl font-semibold text-black">Personal Info</h2>
            </div>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto lg:mx-0"
              data-aos-delay="600"
              data-aos="fade-down"
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

            {/* Resume Button */}
            <Tippy content="Download My CV">
              {aboutData.resume.href ? (
                <a
                  href={aboutData.resume.href}
                  download={aboutData.resume.download ? true : undefined}
                  className={resumeButtonClasses}
                  aria-label="Download CV"
                  data-aos-delay="600"
                  data-aos="fade-down"
                  style={{ transition: "all 300ms ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "black"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={(e)  => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "black"; }}
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
                  data-aos-delay="600"
                  data-aos="fade-down"
                  style={{ transition: "all 300ms ease" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "black"; e.currentTarget.style.color = "white"; }}
                  onMouseOut={(e)  => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "black"; }}
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