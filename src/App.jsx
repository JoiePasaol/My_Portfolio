import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import DarkModeToggle from './components/DarkModeToggle';

// Lazy load sections for better performance
const Home = lazy(() => import('./sections/Hero'));
const About = lazy(() => import('./sections/About'));
const Experience = lazy(() => import('./sections/Experience'));
const Portfolio = lazy(() => import('./sections/Portofolio'));
const Testimonials = lazy(() => import('./sections/Testimonial'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ScrollToTop = lazy(() => import('./components/ScrollToTop'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <>
      {/* This wrapper clips the off-canvas menu's translated position */}
      <div className="relative overflow-x-hidden">
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Home />
          <About />
          <Experience />
          <Portfolio />
          <Testimonials />
          <Contact />
          <Footer />
        </Suspense>
      </div>

      {/* Fixed buttons outside the wrapper — never clipped */}
      <Suspense fallback={null}>
        <DarkModeToggle />
        <AIChatbot />
        <ScrollToTop />
      </Suspense>
    </>
  );
}

export default App;