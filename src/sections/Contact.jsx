import { useRef, useCallback, memo } from "react";
import contactData from "../data/contactData.jsx";
import Tippy from '@tippyjs/react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Contact = memo(() => {
  const formRef = useRef(null);

  const sendEmail = useCallback((e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_qpwpl5l",
        "template_ggbapsr",
        formRef.current,
        "z0MRG5TR-7H0QNyHe"
      )
      .then(() => {
        Swal.fire({
          title: "Message Sent! ✉️",
          text: "Thank you for reaching out. I'll get back to you soon!",
          icon: "success",
          confirmButtonColor: "#1F2937",
          confirmButtonText: "Cool 😎",
        });
        formRef.current.reset();
      })
      .catch((error) => {
        Swal.fire({
          title: "Oops! 😢",
          text: "Something went wrong. Please try again later.",
          icon: "error",
        });
        console.error(error);
      });
  }, []);

  return (
    <section
      id="contact"
      className="min-h-screen pb-20 bg-white dark:bg-black pt-10 scroll-mt-20 overflow-x-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title & Subtitle */}
        <div className="text-center mb-12" data-aos-delay="600" data-aos="fade-down">
          <h2 className="text-5xl font-bold text-black dark:text-white mb-2">
            {contactData.title}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {contactData.subtitle}
          </p>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">

            {/* Left Side: Social Links */}
            <div className="grid gap-4 w-full lg:max-w-xl lg:mx-0 mx-auto" data-aos-delay="600" data-aos="fade-right">
              {contactData.socials.map((item, index) => (
                <a    
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-7 w-full py-7 border border-black dark:border-white/20 rounded-lg shadow-lg text-black dark:text-white hover:shadow-xl hover:-translate-y-1 hover:border-black dark:hover:border-white transition-all"
                  aria-label={item.label}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 flex items-center justify-center shadow-lg rounded-lg bg-transparent border border-black dark:border-white/20 text-black dark:text-white shrink-0">
                      <i className={`${item.icon} text-xl`} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-2xl leading-tight">
                        {item.label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <i className="bx bx-chevron-right text-2xl text-black dark:text-white" />
                </a>
              ))}
            </div>

            {/* Right Side: Contact Form */}
            <div
              className="rounded-lg py-12 px-7 shadow-lg border border-black dark:border-white/20 h-fit w-full lg:max-w-xl lg:mx-0 mx-auto"
              data-aos-delay="600"
              data-aos="fade-left"
            >
              <h3 className="text-xl font-semibold mb-6 text-black dark:text-white flex items-center gap-2">
                <i className="bx bx-envelope text-lg" />
                Send Me a Message
              </h3>
              <form ref={formRef} onSubmit={sendEmail} className="grid gap-4">
                <input
                  type="text"
                  name="from_name"
                  placeholder="Your Name"
                  required
                  className="p-3 rounded-lg border border-black dark:border-white/20 bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/30 transition-colors"
                />
                <input
                  type="email"
                  name="from_email"
                  placeholder="Your Email"
                  required
                  className="p-3 rounded-lg border border-black dark:border-white/20 bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/30 transition-colors"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  className="p-3 rounded-lg border border-black dark:border-white/20 bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/30 transition-colors"
                  rows="5"
                />
                <Tippy content="Send your message" placement="top">
                  <button
                    type="submit"
                    className="px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:bg-black/80 dark:hover:bg-white/80"
                  >
                    Send
                    <i className="bx bx-send text-[1.2rem] translate-y-[1px]" />
                  </button>
                </Tippy>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;