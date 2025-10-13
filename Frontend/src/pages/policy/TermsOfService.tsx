import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-gray-600">Last updated: October 26, 2023</p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By accessing and using our service, you accept and agree to be bound by these Terms of
          Service. If you do not agree to these terms, do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. User Accounts</h2>
        <p className="text-gray-700">
          You are responsible for maintaining the confidentiality of your account password and are
          responsible for all activities that occur under your account. You agree to notify us
          immediately of any unauthorized use of your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Content and Conduct</h2>
        <p className="text-gray-700">
          You are solely responsible for the content you upload and manage through our service. You
          agree not to upload any content that is illegal, misleading, or violates any third party's
          rights.
        </p>
      </section>

      {/* Add more sections as needed */}
    </div>
  );
};

export default TermsOfService;
