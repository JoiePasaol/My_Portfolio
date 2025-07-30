import { useState, useEffect } from "react";
import navbarData from "../data/navbarData.jsx";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeId, setActiveId] = useState(null);
  
    const currentYear = () => new Date().getFullYear();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 }
        );

        navbarData.forEach((item) => {
            const section = document.getElementById(item.id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClick = (id) => {
        setActiveId(id);
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white fixed top-0 left-0 w-full z-50 p-1.5 overflow-hidden shadow-lg transition-all duration-300" data-aos-duration="1000" data-aos="fade-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="flex items-center justify-between h-16">
                            <a href="#" className="flex items-center gap-2">
                                <img src="/assets/logo.png" alt="My Portofolio" className="h-14 w-auto" />
                            </a>

                            {/* Mobile menu button - always visible on mobile */}
                            <div className="flex md:hidden">
                                <button
                                    className="text-gray-700 focus:outline-none"
                                    onClick={toggleMenu}
                                    aria-label="Toggle menu"
                                >
                                    <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'} text-3xl`}></i>
                                </button>
                            </div>

                            {/* Desktop Menu */}
                            <ul className="hidden md:flex items-center gap-6">
                                {navbarData.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            onClick={() => handleClick(item.id)}
                                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${activeId === item.id
                                                ? "shadow-2xl bg-black text-white"
                                                : "text-black transition duration-300 hover:text-white hover:bg-black"
                                                }`}>
                                            <i className={`bx ${item.icon}`}></i>
                                            <span>{item.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                 
                </div>
            </nav>

            {/* Off-Canvas Mobile Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-70 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <i className="bx bx-code-alt text-2xl text-gray-800"></i>
                            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
                        </div>
                        <button
                            className="text-gray-800 focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
                            onClick={toggleMenu}
                            aria-label="Close menu"
                        >
                            <i className="bx bx-x text-2xl"></i>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto py-6">
                        <ul className="flex flex-col gap-2 px-6">
                            {navbarData.map((item, index) => (
                                <li
                                    key={item.id}
                                    className={`transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                        }`}
                                    style={{
                                        transitionDelay: `${isMenuOpen ? index * 0.1 : 0}s`
                                    }}
                                >
                                    <a
                                        href={`#${item.id}`}
                                        onClick={() => handleClick(item.id)}
                                        className={`flex items-center gap-3 text-lg font-medium px-4 py-3 rounded-lg transition-all duration-200 ${activeId === item.id
                                            ? "bg-gray-800 text-white shadow-lg"
                                            : "text-gray-800 hover:text-blue-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <i className={`bx ${item.icon} text-xl`}></i>
                                        <span>{item.label}</span>
                                        <i className="bx bx-chevron-right ml-auto text-xl"></i>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                            © {currentYear()} Joie Pasaol. All rights reserved
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;