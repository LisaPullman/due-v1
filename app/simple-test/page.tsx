'use client';

export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          FoxAI 记账软件测试页面
        </h1>
        <p className="text-gray-600 mb-4">
          如果你能看到这个页面，说明 Next.js 应用已经成功启动！
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ Next.js 运行正常</p>
          <p className="text-sm text-gray-500">✅ Tailwind CSS 样式正常</p>
          <p className="text-sm text-gray-500">✅ TypeScript 编译正常</p>
        </div>
        <div className="mt-6">
          <a 
            href="/"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            返回主页
          </a>
        </div>
      </div>
    </div>
  );
}