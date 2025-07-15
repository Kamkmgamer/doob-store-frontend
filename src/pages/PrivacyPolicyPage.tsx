import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
          Privacy <span className="text-teal-600">Policy</span>
        </h1>
        <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-xl p-8 space-y-6">
          <p className="text-gray-700 text-lg">
            Your privacy is important to us. At MyShop, we adhere to key principles:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-1">
            <li>Minimal data collection and retention</li>
            <li>Full transparency on usage and sharing</li>
            <li>Strong protection of personal data</li>
          </ul>
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3 mt-6">Information We Collect</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We collect your information only for essential purposes like improving services and fulfilling orders.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3 mt-6">Your Choices</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              You can update your data, disable cookies, or opt out of communications at any time.
            </p>
          </section>
          <p className="text-center text-teal-700 font-medium text-lg mt-6">
            For questions, email us at khalilabdalmajeed@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
