import Link from "next/link";
import Image from "next/image";

const OurProject = () => {
  const projects = [
    {
      title: "Split & Bill",
      description: "A collaborative bill-splitting application that helps groups manage shared expenses effortlessly. From its inception, we've crafted a solution that makes splitting and sharing bills intuitive and fair for everyone involved.",
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' /%3E%3C/svg%3E",
      link: "https://splitbill.futureboard.xyz/"
    },
    {
      title: "Jobseekr",
      description: "Align Your Resume. Accelerate Your Career.Generic resumes miss opportunities. By analyzing your current profile against job-specific requirements, we help you present your most relevant strengths—positioning you as the ideal candidate every time.",
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3E%3C/svg%3E",
      link: "https://jobseekr.futureboard.xyz/"
    },
    {
      title: "Software to fit",
      description: "Our dedicated team stays at the forefront of technological innovation, continuously exploring new trends and conducting proof-of-concepts. We're committed to delivering cutting-edge solutions that drive digital transformation.",
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /%3E%3C/svg%3E",
      link: ""
    },
    {
      title: "Consulting",
      description: "Leveraging our diverse team's extensive project experience, we provide comprehensive consulting services. From project management and architecture design to tool implementation, we ensure successful client delivery and project execution.",
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' /%3E%3C/svg%3E",
      link: ""
    }
  ];

  return (
    <section id="our-projects" className="formula min-h-screen bg-[#FBFFE9]">
      <div className="inner-section-container h-full">
        <div className="centered-title-holder py-8 md:py-16">
          <h2 className="text-3xl md:text-5xl font-bold text-center" data-aos="fade-up" data-aos-once="true">
            OUR PROJECTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
          {projects.map((project, index) => (
            <div key={index} className="h-[400px] md:h-[500px]">
              <div 
                className="inner-container relative group cursor-pointer h-full" 
                data-aos="fade-up" 
                data-aos-once="true" 
                data-aos-delay={150 * (index + 1)}
              >
                <div className="bottom-layer bg-white p-4 md:p-6 h-full flex flex-col justify-center transition-all duration-300 group-hover:translate-y-[-10px]">
                  <div className="icon-holder mb-4">
                    <Image
                      src={project.icon}
                      alt={project.title}
                      width={64}
                      height={64}
                      className="w-12 h-12 md:w-16 md:h-16 text-gray-800"
                    />
                  </div>
                  <div className="block-name-holder mb-4">
                    <p className="text-lg md:text-xl font-bold">{project.title}</p>
                  </div>
                  <div className="block-text-holder">
                    <p className="text-sm md:text-base text-gray-600">{project.description}</p>
                  </div>
                </div>

                <div className="top-layer absolute inset-0 bg-[#1d1d1d] p-4 md:p-6 flex flex-col justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  <div className="icon-holder mb-4">
                    <Image
                      src={project.icon}
                      alt={project.title}
                      width={64}
                      height={64}
                      className="w-12 h-12 md:w-16 md:h-16 text-white"
                    />
                  </div>
                  <div className="block-name-holder">
                    <Link href={project.link} target="_blank">
                      <p className="text-lg md:text-xl font-bold text-white">{project.title}</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProject; 