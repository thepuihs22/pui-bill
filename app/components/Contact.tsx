import { Space_Grotesk } from 'next/font/google';

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
      name: "Kor",
      role: "Chief technology officer (CTO)",
      image: "/images/k.jpg"
    },
    {
      name: "Pui",
      role: "Chief executive officer (CEO)",
      image: "/images/p.jpg"
    }
  ];

  return (
    <section id="team" className={`min-h-screen flex items-center justify-center bg-[#FBFFE9] text-gray-800 ${spaceGrotesk.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-left border-b border-[rgba(0,0,0,0.15)] pb-2 sm:pb-3 md:pb-4">OUR TEAM</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative w-full">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
                />
              </div>
              <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-[#111827]">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#E9FE84]">{member.name}</h3>
                <p className="text-sm sm:text-base md:text-lg text-[#E9FE84] leading-tight">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact; 