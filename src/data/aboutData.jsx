const aboutData = {
    title: "About Me",
    subtitle: "Discover my journey, passions, and the story behind my work",
    image: "/assets/about/profile.jpg",

    biodata: [
        { label: "Name", value: "Joie Pasaol", icon: "bx bx-id-card" },
        { label: "Date of Birth", value: "February 13, 2003", icon: "bx bx-calendar" },
        { label: "Place of Birth", value: "Philippines, Agusan del Norte, Magallanes", icon: "bx bx-map" },
        { label: "Email", value: "joie.pasaol13@gmail.com", icon: "bx bx-envelope" },
        { label: "Phone", value: "+63 981 117 1894", icon: "bx bx-phone" },
        { label: "Education", value: "Caraga State University Cabadbaran Campus", icon: "bx bx-book" },
    ],

    resume: {
        label: "Download My Resume",
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
            title: "Web Developer - FDG (Form Developer Group)",
            company: "Proweaver, Inc.",
            period: "December 2025 – Present",
            subtitle: "Developed and customized web forms based on client-provided field labels, requirements, and preferred designs.",
            bullets: [
                "Ensured accurate data handling and database integration for form submissions.",
                "Collaborated with the Form Developer Group (FDG) to build functional and user-friendly form solutions.",
                "Performed Quality Assurance (QA) testing to ensure client websites and forms functioned properly across workflows.",
                "Maintained and troubleshot client websites by identifying and fixing bugs and technical issues.",
                "Implemented new website features and enhancements based on client feedback and suggestions.",
                "Worked closely with clients and team members to deliver reliable and efficient web solutions.",
            ],
            galleryImages: [
                "/assets/about/NoAvailable.webp",
                "/assets/about/NoAvailable.webp",
                "/assets/about/NoAvailable.webp",
            ],
        },
        {
            title: "Web Developer Intern",
            company: "eComia",
            period: "5+ Months",
            subtitle: "Served as a Web Developer Intern for over 5 months, collaborating with fellow interns on the development of two projects and culminating in formal presentations to the company's CEO and management team.",
            bullets: [
                "Created visually appealing layouts and improved overall user experience.",
                "Designed wireframes, mockups, and prototypes based on project requirements.",
                "Collaborated with team members to implement website features and design improvements.",
                "Assisted in testing, debugging, and maintaining website functionality.",
                "Ensured websites were optimized for different devices and screen sizes.",
                "Helped improve website performance, accessibility, and usability.",
            ],
            galleryImages: [
                "/assets/about/a.jpeg",
                "/assets/about/c.jpeg",
                "/assets/about/b.jpeg",
            ],
        },
    ],
};

export default aboutData;