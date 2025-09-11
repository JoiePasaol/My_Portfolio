const aboutData = {
    title: "About Me",
    subtitle: "Discover my journey, passions, and the story behind my work",
    image: "/assets/about/profile.jpg",

    galleryImages: [
        "/assets/about/a.jpeg",
        "/assets/about/c.jpeg",
        "/assets/about/b.jpeg",
     
      ],

    biodata: [
        { label: "Name", value: "Joie Pasaol", icon: "bx bx-id-card" },
        { label: "Date of Birth", value: "February 13, 2003", icon: "bx bx-calendar" },
        { label: "Place of Birth", value: "Philippines, Agusan del Norte, Magallanes", icon: "bx bx-map" },
        { label: "Email", value: "joie.pasaol13@gmail.com", icon: "bx bx-envelope" },
        { label: "Phone", value: "+63 981 117 1894", icon: "bx bx-phone" },
        { label: "Education", value: "Caraga State University Cabadbaran Campus", icon: "bx bx-book" },
     
    ],

    resume: {
        label: "Download My CV",
        href: "/assets/CV.pdf",
        icon: "bx bx-download",
        download: true,
    },

    aboutNarrative: {
        whoAmI: {
            text: `I am a graduate of Bachelor of Science in Information Technology. I am curious, adaptable, and driven by a passion for continuous growth in the ever evolving world of technology.`,
            icon: "bx-info-circle"
        },
        approach: {
            text: `I focus on practical, user-centered solutions. I break down problems logically, build efficiently, and adapt quickly to new challenges always aiming for clean, reliable results.`,
            icon: "bx-bulb"
        }
    },

    experience: [
        {
            title: "Experience",
            subtitle: "Served as a Web Developer Intern for over 5 months, collaborating with fellow interns on the development of two projects and culminating in formal presentations to the company's CEO and management team.",
        },
    ],


};

export default aboutData;
