import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load sections for better performance
const Home = lazy(() => import('./sections/Hero'));
const About = lazy(() => import('./sections/About'));
const Portfolio = lazy(() => import('./sections/Portofolio'));
const Testimonials = lazy(() => import('./sections/Testimonial'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ScrollToTop = lazy(() => import('./components/ScrollToTop'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);


    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <LoadingSpinner />;
  }


  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
        <About />
        <Portfolio />
        <Testimonials />
        <Contact />
        <Footer />
        <ScrollToTop />
      </Suspense>
    </>
  );
}

export default App;