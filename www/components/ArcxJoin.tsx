import React from 'react';

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.317,4.369a19.789,19.789,0,0,0-4.885-1.515.074.074,0,0,0-.079.037,14.2,14.2,0,0,0-1.127,2.224,19.159,19.159,0,0,0-5.625,0,14.54,14.54,0,0,0-1.127-2.224.077.077,0,0,0-.079-.037A19.787,19.787,0,0,0,3.683,4.369a.076.076,0,0,0-.04.076A16.425,16.425,0,0,0,2.1,14.855a.077.077,0,0,0,.042.083,18.156,18.156,0,0,0,3.985,1.52.073.073,0,0,0,.08-.035,12.3,12.3,0,0,0,.64-2.22,17.65,17.65,0,0,0-2.812-.914.074.074,0,0,0-.08,0,13.255,13.255,0,0,0-.222,4.423.076.076,0,0,0,.066.078,19.2,19.2,0,0,0,6.1,1.77h.042a19.173,19.173,0,0,0,6.1-1.77.076.076,0,0,0,.066-.078,13.21,13.21,0,0,0-.222-4.423.074.074,0,0,0-.08,0,17.691,17.691,0,0,0-2.812.914.075.075,0,0,0,.08.035,12.336,12.336,0,0,0,.64,2.22.076.076,0,0,0,.08.035,18.156,18.156,0,0,0,3.985-1.52.077.077,0,0,0,.042-.083A16.425,16.425,0,0,0,20.357,4.445a.076.076,0,0,0-.04-.076ZM8.02,12.316c-1.049,0-1.9-.96-1.9-2.15s.85-2.15,1.9-2.15,1.9.96,1.9,2.15S9.069,12.316,8.02,12.316Zm7.96,0c-1.049,0-1.9-.96-1.9-2.15s.85-2.15,1.9-2.15,1.9.96,1.9,2.15S17.029,12.316,15.98,12.316Z" />
    </svg>
);


const ArcxJoin: React.FC = () => {
  return (
    <div id="arcx-join" className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-adam-black relative">
         <div className="absolute inset-0 z-0 bg-adam-dark">
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-arcx-orange-dark/20 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
        </div>

      <div className="relative z-10">
        <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
          Build the Economic Layer
        </h2>
        <p className="mt-4 text-adam-light-gray font-light max-w-xl mx-auto">
          The Arc is a community-driven ecosystem. Join the discussion, contribute to development, and help define the future of on-chain capital.
        </p>
        <div className="mt-10">
            <a href="#" className="border border-arcx-orange text-arcx-orange font-light py-4 px-12 rounded-sm text-md uppercase tracking-[0.2em] hover:bg-arcx-orange hover:text-black hover:shadow-glow-orange transition-all duration-300">
                Join The Community
            </a>
        </div>
      </div>
       <footer className="absolute bottom-8 text-center text-xs text-gray-700 font-light tracking-widest w-full">
         <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="text-gray-600 hover:text-arcx-orange transition-colors duration-300" aria-label="ARCx Twitter">
            <span className="sr-only">Twitter</span>
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-600 hover:text-arcx-orange transition-colors duration-300" aria-label="ARCx Discord">
            <span className="sr-only">Discord</span>
            <DiscordIcon className="h-5 w-5" />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} THE ARC ECOSYSTEM. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

export default ArcxJoin;