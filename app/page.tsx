"use client";

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowWeWork from './components/HowWeWork';
import OurProject from './components/OurProject';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('company');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFFE9] text-gray-800">
      <Navbar activeSection={activeSection} onSectionClick={scrollToSection} />
      
      <main>
        <Hero />
        <HowWeWork />
        <OurProject />
        <AboutUs />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
