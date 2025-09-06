import { useEffect, useState, useCallback, memo } from "react";

const ScrollToTop = memo(() => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        isVisible && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 w-15 h-15 flex items-center drop-shadow-2xl justify-center rounded-full bg-black text-white shadow-lg cursor-pointer  transition-all hover:scale-103"   data-aos="fade-top"
                aria-label="Scroll to Top"
            >
                <i className="bx bx-chevron-up text-2xl" />
            </button>

        )
    );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;
