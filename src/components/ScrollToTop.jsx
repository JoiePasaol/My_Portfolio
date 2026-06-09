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
                className="fixed bottom-4 sm:bottom-6 right-2 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full drop-shadow-2xl bg-black dark:bg-white text-white dark:text-black shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Scroll to Top"
            >
                <i className="bx bx-chevron-up text-2xl" />
            </button>
        )
    );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;