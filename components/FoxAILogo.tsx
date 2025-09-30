export default function FoxAILogo() {
  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-8 lg:py-10">
      <div className="relative mb-4 md:mb-6">
        <div className="foxai-gradient w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
          <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Fox</span>
        </div>
        <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-white rounded-full p-1 md:p-2 shadow-lg">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs md:text-sm font-bold">AI</span>
          </div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          FoxAI记账软件
        </h1>
        <p className="text-gray-600 text-sm md:text-base lg:text-lg font-medium">
          智能风险管理 · 简洁高效
        </p>
        <div className="flex items-center justify-center mt-2 md:mt-3">
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs md:text-sm rounded-full font-medium">免费部署</span>
            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs md:text-sm rounded-full font-medium">响应式设计</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs md:text-sm rounded-full font-medium">PWA支持</span>
          </div>
        </div>
      </div>
    </div>
  );
}