const ErrorMessage = ({ message, retry }) => {
  return (
    <div className="max-w-md mx-auto my-12 p-8 backdrop-blur-lg bg-red-50/80 
                  border border-red-200/50 rounded-2xl shadow-2xl 
                  hover:shadow-red-200/50 transition-all duration-300">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Animated glow */}
          <div className="absolute inset-0 w-20 h-20 bg-red-400 rounded-full blur-md opacity-30 animate-pulse"></div>
          
          {/* Icon container */}
          <div className="relative w-16 h-16 backdrop-blur-sm bg-red-100/80 rounded-full 
                        flex items-center justify-center border border-red-200/50">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-red-800 mb-3">
          Algo salió mal
        </h3>
        <p className="text-red-700 font-medium mb-6 leading-relaxed">
          {message || 'No pudimos cargar la información. Por favor, intenta nuevamente.'}
        </p>
        {retry && (
          <button 
            onClick={retry} 
            className="px-6 py-3 backdrop-blur-sm bg-red-500/90 hover:bg-red-600 
                     text-white font-semibold rounded-xl shadow-lg 
                     transition-all duration-300 hover:scale-105 active:scale-95
                     border border-red-400/50 inline-flex items-center gap-2 group">
            <svg className="w-5 h-5 transition-transform group-hover:rotate-180" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
