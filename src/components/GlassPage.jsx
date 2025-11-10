export default function GlassPage({ children }) {
  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="w-full max-w-4xl relative">
        {/* Glow background */}
        <div
          className="absolute -inset-1 rounded-3xl blur-2xl bg-gradient-to-r 
        from-indigo-300 via-cyan-300 to-blue-300 opacity-25 animate-pulse"
        />

        {/* Glass Content Box */}
        <div
          className="relative rounded-2xl border border-white/60 bg-white/80 
        backdrop-blur-xl shadow-xl p-6 sm:p-10"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
