import FutureBoard from "./FutureBoard";
import Image from "next/image";
import FutureboardLogo from "../images/Futureboard_bw.svg";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="company" className="w-full h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#FBFFE9] to-[#FBFFE9]/80 z-0"></div>
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20 flex flex-col items-start gap-2">
        <Image
          src={FutureboardLogo}
          alt="Futureboard Logo"
          width={200}
          height={50}
          className="w-auto h-10 sm:h-14"
        />
        {/* <p className="text-black text-lg font-medium">CREATING A BETTER TMR</p> */}
      </div>
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 flex flex-col sm:flex-row gap-3">
        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#111827] text-[#E6FF74] rounded-lg hover:bg-[#1F2937] transition-colors text-sm sm:text-base">
          <a href="https://pui-bill.vercel.app/bill" target="_blank" rel="noopener noreferrer"><span>Split & Bill</span></a>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#111827] text-[#E6FF74] rounded-lg hover:bg-[#1F2937] transition-colors text-sm sm:text-base">
          <a href="https://jobseekr.futureboard.xyz/" target="_blank" rel="noopener noreferrer"><span>Job Seeker</span></a>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
      <div className="w-full h-full relative">
        <FutureBoard />
      </div>
    </section>
  );
};

export default Hero; 