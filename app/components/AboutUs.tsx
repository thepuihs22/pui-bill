import { useState, useEffect, useRef } from 'react';

const AboutUs = () => {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const fullText = "Simple, smart digital products that improve everyday life";
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const currentRef = sectionRef.current;
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

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
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
    <section ref={sectionRef} id="about-us" className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="home-flashback__header">
          <h4 className="home-flashback__title text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 text-center leading-tight">
           "We aim to empower individuals with intuitive tools that simplify tasks, enhance productivity, and help people adapt to a rapidly evolving digital landscape"
          </h4>
          <div className="home-flashback__prompt">
            <div className="prompt">
              <div className="prompt__wrapper flex flex-col items-center mx-2 sm:mx-4 md:mx-8 lg:mx-16">
                <div className="prompt__label text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mt-2 sm:mt-4 text-center bg-[#829AFF] p-2 sm:p-3 md:p-4 rounded-lg w-full max-w-3xl">
                  <div className="bg-[#111827] p-2 sm:p-3 md:p-4 rounded-lg">
                    <span className="text-splitter text-[#E6FF74] mr-1 sm:mr-2 md:mr-4">
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