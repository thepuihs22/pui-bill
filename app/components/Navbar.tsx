import { useState, useEffect } from 'react';

interface NavbarProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const Navbar = ({ activeSection, onSectionClick }: NavbarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const secondSection = document.getElementById('how-we-work');
      if (secondSection) {
        const secondSectionTop = secondSection.offsetTop;
        setIsVisible(window.scrollY >= secondSectionTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full bg-[#e6ff75]/90 backdrop-blur-sm z-50 py-4 border-gray-200 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800"></div>
          <div className="hidden md:flex space-x-8">
            {['how-we-work', 'our-projects', 'about-us', 'team'].map((section) => (
              <button
                key={section}
                onClick={() => onSectionClick(section)}
                className={`text-sm uppercase tracking-wider hover:text-blue-600 transition-colors ${
                  activeSection === section ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 