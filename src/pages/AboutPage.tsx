import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
          About <span className="text-purple-600">MyShop</span>
        </h1>
        <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At MyShop, we aim to provide high-quality products at competitive prices with a seamless and enjoyable shopping experience.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">Our Story</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Founded in <span className="font-medium">[Year]</span>, we started as a small local business with a dream to make online shopping accessible and reliable for all.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-1">
              <li>Wide selection across categories</li>
              <li>Competitive pricing & discounts</li>
              <li>Secure and easy checkout</li>
              <li>Fast & reliable shipping</li>
              <li>Friendly support team</li>
              <li>Ethical sourcing & sustainability</li>
            </ul>
          </section>
          <p className="text-center text-purple-700 font-medium text-lg">
            Thank you for being part of our journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
