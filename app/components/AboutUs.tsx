import { useState, useEffect, useRef } from 'react';

const AboutUs = () => {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const fullText = "Please try putting something here....";
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1 // Trigger when 10% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, fullText]);

  return (
    <section ref={sectionRef} id="about-us" className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="home-flashback__header">
          <h4 className="home-flashback__title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 text-center leading-tight">
           "We transform ideas into digital results to reinvent the connection between clients and the public."
          </h4>
          <div className="home-flashback__prompt">
            <div className="prompt">
              <div className="prompt__wrapper flex flex-col items-center mx-4 sm:mx-8 md:mx-12 lg:mx-24">
                <div className="prompt__label text-lg sm:text-xl md:text-2xl font-semibold mt-4 text-center bg-[#829AFF] p-2 sm:p-3 md:p-4 rounded-lg w-full max-w-3xl">
                  <div className="bg-[#111827] p-2 sm:p-3 md:p-4 rounded-lg">
                    <span className="text-splitter text-[#E6FF74] mr-2 sm:mr-4 md:mr-10">
                      {text}
                      <span className="animate-pulse">|</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 