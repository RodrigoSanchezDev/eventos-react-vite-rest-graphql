const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const glowSize = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Gradient glow effect */}
        <div className={`absolute inset-0 ${glowSize[size]} -translate-x-2 -translate-y-2
                      rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                      opacity-30 blur-xl animate-pulse`}></div>
        
        {/* Main spinner with gradient border */}
        <div className={`relative ${sizeClasses[size]} rounded-full animate-spin
                      bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1
                      shadow-lg shadow-primary-900/20`}>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
      </div>
      {text && (
        <p className="mt-6 text-primary-700 font-semibold animate-pulse 
                    bg-gradient-to-r from-primary-600 to-accent-600 
                    bg-clip-text text-transparent">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
