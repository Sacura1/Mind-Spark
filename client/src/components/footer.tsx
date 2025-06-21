
const Footer = () => {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-cyan-500/20">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> 
        </div>
      </div>

      <div className="bg-gray-950/80 backdrop-blur-sm border-t border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">© 2025 Mind-Spark Network. All rights reserved.</p>
            </div>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
