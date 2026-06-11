const aboutData = {
  title: "About Me",
  subtitle: "Discover my journey, passions, and the story behind my work",
  image: "/assets/about/profile.jpg",

  biodata: [
    { label: "Name",          value: "Joie Pasaol",                                    icon: "bx bx-id-card"  },
    { label: "Date of Birth", value: "February 13, 2003",                              icon: "bx bx-calendar" },
    { label: "Place of Birth",value: "Philippines, Agusan del Norte, Magallanes",      icon: "bx bx-map"      },
    { label: "Email",         value: "joie.pasaol13@gmail.com",                        icon: "bx bx-envelope" },
    { label: "Phone",         value: "+63 981 117 1894",                               icon: "bx bx-phone"    },
    { label: "Education",     value: "Caraga State University Cabadbaran Campus",      icon: "bx bx-book"     },
  ],

  resume: {
    label: "Download My Resume",
    href: "/assets/RESUME.pdf",
    icon: "bx bx-download",
    download: true,
  },

  aboutNarrative: {
    whoAmI: {
      text: `I am a graduate of Bachelor of Science in Information Technology. I am curious, adaptable, and driven by a passion for continuous growth in the ever evolving world of technology.`,
      icon: "bx-info-circle",
    },
    approach: {
      text: `I focus on practical, user-centered solutions. I break down problems logically, build efficiently, and adapt quickly to new challenges always aiming for clean, reliable results.`,
      icon: "bx-bulb",
    },
  },
};

export default aboutData;