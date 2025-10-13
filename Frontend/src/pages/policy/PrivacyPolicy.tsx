import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-gray-600">Last updated: October 26, 2023</p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
        <p className="text-gray-700">
          We collect personal information that you voluntarily provide to us when you register on
          the website, express an interest in obtaining information about us or our products and
          services, when you participate in activities on the website, or otherwise when you contact
          us.
        </p>
        <ul className="mt-4 list-inside list-disc text-gray-700">
          <li>
            <strong>Personal Information:</strong> Includes your name, email address, and Google
            account ID.
          </li>
          <li>
            <strong>YouTube Channel Data:</strong> We collect your YouTube channel name, channel ID,
            and other public data to provide our services.
          </li>
          <li>
            <strong>Usage Data:</strong> We automatically collect information when you visit or use
            our website.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
        <p className="text-gray-700">
          We use the information we collect for various business purposes, including to:
        </p>
        <ul className="mt-4 list-inside list-disc text-gray-700">
          <li>Facilitate account creation and authentication.</li>
          <li>Operate, maintain, and improve our services.</li>
          <li>Communicate with you about your account or services.</li>
          <li>Monitor and analyze usage and trends to improve your experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Security of Your Information</h2>
        <p className="text-gray-700">
          We use administrative, technical, and physical security measures to help protect your
          personal information. While we have taken reasonable steps to secure the personal
          information you provide to us, please be aware that despite our efforts, no security
          measures are perfect or impenetrable.
        </p>
      </section>

      {/* Add more sections as needed */}
    </div>
  );
};

export default PrivacyPolicy;
