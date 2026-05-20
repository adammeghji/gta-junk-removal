export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Same-Day Junk Removal
        </h1>
        <p className="text-xl md:text-2xl text-orange-100 mb-8">
          Greater Toronto Area's fastest and most convenient junk removal
          service.
        </p>
        <a
          href="/book"
          className="inline-block bg-white text-brand-600 font-bold text-lg px-8 py-4 rounded-full hover:bg-orange-50 transition-colors"
        >
          Book Now — Free Quote
        </a>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Get a Quote", desc: "Tell us what you need removed. Pricing in seconds, no surprises." },
            { step: "2", title: "We Show Up", desc: "Our crew arrives the same day, usually within 2 hours." },
            { step: "3", title: "Done!", desc: "We haul it away. You pay only when the job's complete." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <p>© {new Date().getFullYear()} GTA Junk Removal. All rights reserved.</p>
        <p className="text-sm mt-1">Serving Toronto, Mississauga, Brampton, Markham, Vaughan & surrounding areas.</p>
      </footer>
    </main>
  );
}
