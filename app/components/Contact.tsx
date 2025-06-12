import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const Contact = () => {
  const teamMembers = [
    {
      name: "Champ",
      role: "Chief commercial officer (CCO)",
      image: "/images/c.jpg"
    },
    {
      name: "Pui",
      role: "Chief executive officer (CEO)",
      image: "/images/p.jpg"
    },
    {
      name: "Kor",
      role: "Chief technology officer (CTO)",
      image: "/images/k.jpg"
    }
  ];

  return (
    <section id="team" className={`min-h-screen flex items-center justify-center bg-[#FBFFE9] text-gray-800 ${spaceGrotesk.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-left border-b border-[rgba(0,0,0,0.15)] pb-2 sm:pb-3 md:pb-4">TEAM</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex">
                <div className="relative w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 flex-shrink-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                    priority={index === 0}
                  />
                </div>
                <div className="flex-1 p-4 sm:p-6 md:p-8 bg-[#111827] flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#E9FE84]">{member.name}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-[#E9FE84] leading-relaxed">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact; 