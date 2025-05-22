import { useState } from "react";
import Image from "next/image";

const HowWeWork = () => {
  const [selectedStep, setSelectedStep] = useState(0);

  const steps = [
    {
      title: "Hello",
      image: "/images/hello.svg",
      description: "The first people you will meet are our business, UX and technology experts."
    },
    {
      title: "Research and reach",
      image: "/images/research.svg",
      description: "It's the first stage, when we start compiling information and building a creative brief that will act as the first draft of the project."
    },
    {
      title: "Design",
      image: "/images/design.svg",
      description: "Once we understand all aspects of the product, we start designing the interface and user experience. Drawing, framing, designing and animating to create smart and elegant designs"
    },
    {
      title: "Front-end",
      image: "/images/frontend.svg",
      description: "Every digital product needs a solid multi-platform interface. On this stage we focus on turning out design into tangible pieces, where you can browse and enjoy usability."
    },
    {
      title: "Backend & CMS",
      image: "/images/backend.svg",
      description: "Designing a scalable and safe management panel, customized to the needs of each client, is our daily business."
    },
    {
      title: "Testing",
      image: "/images/testing.svg",
      description: "Extensive testing sessions allow us to identify ways of improving the product and help users achieve their objectives in the least amount of time possible."
    },
    {
      title: "Launch",
      image: "/images/launch.svg",
      description: "We will organize the product's launch."
    },
    {
      title: "Maintenance",
      image: "/images/maintenance.svg",
      description: "Each project evolves with time. We offer maintenance and periodic updates."
    }
  ];

  return (
    <section id="how-we-work" className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="como-hacemos-title-holder mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-center">How do we do it?</h3>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block graph-desktop">
          <div className="flex justify-center mb-8">
            <Image 
              src='https://helphumans.digital/wp-content/uploads/2021/08/Investigacio%CC%81n-alcance.svg' 
              alt='Investigacio%CC%81n-alcance' 
              width={1000} 
              height={1000}
              className="brightness-0 invert"
            />
          </div>
          <div className="graph-container flex justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="mx-2">
                {/* <Image
                  src={step.image}
                  alt={step.title}
                  width={100}
                  height={100}
                  className={`transition-opacity duration-300 ${selectedStep === index ? 'opacity-100' : 'opacity-50'}`}
                /> */}
              </div>
            ))}
          </div>

          <div className="graph-nav flex justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="graph-nav-holder mx-4">
                <button
                  onClick={() => setSelectedStep(index)}
                  className={`text-lg font-medium transition-colors duration-300 ${
                    selectedStep === index ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {step.title}
                </button>
              </div>
            ))}
          </div>

          <div className="graph-texts text-center">
            <div className="graph-text-holder border-2 border-[#e6ff75e6] rounded-lg p-6">
              <p className="text-xl text-gray-300">{steps[selectedStep].description}</p>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden graph-mobile">
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${selectedStep * 100}%)` }}>
                {steps.map((step, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="flex justify-center mb-8">
                      <Image 
                        src='https://helphumans.digital/wp-content/uploads/2021/08/Investigacio%CC%81n-alcance.svg' 
                        alt='Investigacio%CC%81n-alcance' 
                        width={1000} 
                        height={1000}
                        className="brightness-0 invert"
                      />
                    </div>
                    <div className="graph-nav flex justify-center mb-8">
                      {steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="graph-nav-holder mx-2">
                          <button
                            onClick={() => setSelectedStep(stepIndex)}
                            className={`text-sm font-medium transition-colors duration-300 ${
                              selectedStep === stepIndex ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {step.title}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="graph-texts text-center">
                      <div className="graph-text-holder border-2 border-[#e6ff75e6] rounded-lg p-4">
                        <p className="text-lg text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="navigation-holder flex justify-between mt-8">
              <button
                onClick={() => setSelectedStep(prev => Math.max(0, prev - 1))}
                className="nav-button nav-left p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                disabled={selectedStep === 0}
              >
                <Image src="/images/chev.svg" alt="Previous" width={24} height={24} className="rotate-180" />
              </button>
              <button
                onClick={() => setSelectedStep(prev => Math.min(steps.length - 1, prev + 1))}
                className="nav-button nav-right p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                disabled={selectedStep === steps.length - 1}
              >
                <Image src="/images/chev.svg" alt="Next" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork; 