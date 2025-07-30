import footerData from "../data/footerData.jsx";
import Tippy from "@tippyjs/react";


const Footer = () => {
  return (
    <footer className="bg-white shadow-top text-gray-800 dark:text-white py-12">
      <div className="max-w-6xl mx-auto md:pl-8   px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-black flex items-center text-2xl font-bold mb-2 gap-2">
            <img
              src="/assets/logo.png"
              alt="My Portofolio"
              className="h-12 w-auto"
            />
            {footerData.brand.name}
          </h3>
          <p className="text-sm text-black">{footerData.brand.description}</p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-black flex items-center gap-2 text-lg font-semibold mb-3">
            <i className={`${footerData.navigationIcon} text-base`}></i>
            Navigation
          </h4>
          <ul className="flex flex-col gap-2 text-sm">
            {footerData.navigation.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-black hover:text-gray-600 transition"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-black flex items-center gap-2 text-lg font-semibold mb-3">
            <i className={`${footerData.socialsIcon} text-base`}></i>
            Find Me Online
          </h4>
          <ul className="flex flex-wrap gap-3">
            {footerData.socials.map((social, index) => (
              <li key={index}>
                <Tippy content={social.label} placement="top">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-black shadow-md hover:scale-110 transition-all">
                      <i className={`${social.icon} text-xl`} />
                    </div>
                  </a>
                </Tippy>
              </li>
            ))}
          </ul>
        </div>

       {/* Copyright */}
        <div  className="text-center md:text-left text-black  ">
          {footerData.copyright}
        </div>
      </div>

  
    </footer>
  );
};

export default Footer;
