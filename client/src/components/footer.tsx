
const Footer = () => {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-cyan-500/20 min-h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"></div>
      </div>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-gray-400 text-sm text-center">
              © 2025 Mind-Spark Network. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center">
              Made by{' '}
              <a
                href="https://x.com/Malachy36"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                @Malachy36
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
