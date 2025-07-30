import Navbar from './components/Navbar';
import Home from './sections/Hero';
import About from './sections/About';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Contact from './sections/Contact';
import Testimonials from './sections/Testimonial';
import Portfolio from './sections/Portofolio';


function App() {

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default App
