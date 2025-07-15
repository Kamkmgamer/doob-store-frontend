import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
          Terms of <span className="text-red-600">Service</span>
        </h1>
        <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-xl p-8 space-y-6">
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              By accessing MyShop, you agree to these terms. If you disagree, please discontinue use.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3 mt-6">2. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-1">
              <li>Keep your account credentials secure</li>
              <li>Notify us of unauthorized access immediately</li>
            </ul>
          </section>
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3 mt-6">3. Liability</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We are not liable for indirect or incidental damages arising from your use of our services.
            </p>
          </section>
          <p className="text-center text-red-700 font-medium text-lg mt-6">
            Questions? Email us at khalilabdalmajeed@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
