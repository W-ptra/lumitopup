function PromoBanner() {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl
        bg-gradient-to-r from-[#7491F7] to-[#5F7CFB]
        text-white
        px-5 py-6
        md:px-8 md:py-8
      "
    >
      {/* Decorative shapes (smaller on mobile) */}
      <div className="absolute -left-12 -top-12 w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10" />
      <div className="absolute -right-16 top-1/2 w-36 h-36 md:w-48 md:h-48 rounded-full bg-white/10 -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-xl md:text-3xl font-bold leading-snug">
          Selamat Datang di <br className="sm:hidden" />
          LumiTopUp
        </h2>

        <p className="mt-2 text-sm md:text-base text-white/90">
          Top up game favoritmu dengan cepat, aman, dan harga terbaik.
        </p>

        {/* CTA */}
        <div className="mt-4">
          <button
            className="
              w-full sm:w-auto
              bg-white
              text-[#7491F7]
              font-semibold
              px-6 py-3
              rounded-xl
              text-sm md:text-base
              hover:bg-gray-100
              transition
            "
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromoBanner;
