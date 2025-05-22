import FutureBoard from "./FutureBoard";
import Image from "next/image";
import FutureboardLogo from "../images/Futureboard_bw.svg";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="company" className="w-full min-h-screen flex items-center justify-center relative pt-16">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#FBFFE9] to-[#FBFFE9]/80 z-0"></div>
      <div className="absolute top-8 left-8 z-20 flex flex-col items-start gap-2">
        <Image
          src={FutureboardLogo}
          alt="Futureboard Logo"
          width={200}
          height={50}
          className="w-auto h-14"
        />
        {/* <p className="text-black text-lg font-medium">CREATING A BETTER TMR</p> */}
      </div>
      <div className="absolute top-8 right-8 z-20 flex flex-row gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-[#E6FF74] rounded-lg hover:bg-[#1F2937] transition-colors">
          <span>Split & Bill</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-[#E6FF74] rounded-lg hover:bg-[#1F2937] transition-colors">
          <span>Job Seeker</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <FutureBoard />
    </section>
  );
};

export default Hero; 