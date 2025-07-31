import { useState } from "react";
import { portfolioData } from "../data/portofolioData.jsx";
import "tippy.js/dist/tippy.css";
import ProjectModal from "../components/ProjectModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="portofolio" className="min-h-screen pb-20 bg-white pt-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Subtitle */}
        <div
          className="text-center mb-12 text-gray-800"
          data-aos-delay="600"
          data-aos="fade-down"
        >
          <h2 className="text-5xl font-bold text-black mb-2">
            {portfolioData.sectionTitle.title}
          </h2>
          <p className="text-lg text-black">
            {portfolioData.sectionTitle.subtitle}
          </p>
        </div>

        {/* Tabs Menu */}
        <div
          className="flex justify-center mb-8 gap-4 flex-wrap"
          data-aos-delay="600"
          data-aos="fade-down"
        >
          {[
            { value: "projects", label: "Projects", icon: "bx bx-briefcase" },
            {
              value: "certificates",
              label: "Certificates",
              icon: "bx bx-award",
            },
            { value: "tech", label: "Skills", icon: "bx bx-code-alt" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.value
                  ? "bg-black text-white hover:bg-black hover:text-white"
                  : "text-black border border-black hover:bg-black hover:text-white"
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div>
                     {/* Projects Tab */}
          {activeTab === "projects" && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              data-aos-delay="600"
              data-aos="fade-down"
            >
              {portfolioData.tabs.projects.map((project) => (
                <Card
                  key={project.id}
                  className="group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => setSelectedProject(project)}
                      className="w-full"
                    >
                      <i className="fa-solid fa-expand text-white" />View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              data-aos-delay="600"
              data-aos="fade-down"
            >
              {portfolioData.tabs.certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="border border-black rounded-lg shadow-lg hover:-translate-y-1 transition-transform overflow-hidden cursor-pointer"
                  onClick={() => setSelectedCertificate(certificate)}
                >
                  <img
                    src={certificate.img}
                    alt={certificate.title}
                    className="w-full h-72 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Modal with fade-in and zoom-in effect */}
          {selectedCertificate && (
            <div
              className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50 fade-in"
              onClick={() => setSelectedCertificate(null)}
            >
              <div
                className="relative max-w-3xl w-full p-4 zoom-in"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedCertificate.img}
                  alt="Certificate"
                  className="w-full h-auto rounded-lg border border-white shadow-2xl"
                />
              </div>
            </div>
          )}

          {/* Tech Stack Tab */}
          {activeTab === "tech" && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              data-aos-delay="600"
              data-aos="fade-down"
            >
              {portfolioData.tabs.techStacks.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-transparent border border-black rounded-lg p-6 shadow-lg hover:-translate-y-1 transition-transform flex flex-col items-center justify-center gap-4"
                >
                  {tech.icon.startsWith("http") || tech.icon.startsWith("/") ? (
                    <img
                      src={tech.icon}
                      alt={tech.label}
                      className="w-16 h-16"
                    />
                  ) : (
                    <i
                      className={`${tech.icon} text-6xl`}
                      style={{ color: tech.color }}
                    ></i>
                  )}

                  <span className="text-lg font-medium text-black">
                    {tech.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
         {/* Project Modal */}
         {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Portfolio;
