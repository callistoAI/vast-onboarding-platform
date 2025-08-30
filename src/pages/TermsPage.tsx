import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-center items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
            <img 
              src="/vast-logo.png" 
              alt="Vast Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hidden">
              <span className="text-white font-bold text-sm">V</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service for Vast Onboarding Platform</h1>
          
          <div className="text-sm text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By using the Vast Onboarding Platform ("the App"), operated by Vast Brands LLC, you agree to these Terms of Service. If you do not agree, you may not use the App.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Purpose of the App</h2>
              <p className="text-gray-700 mb-4">
                The App allows businesses to connect and verify their accounts across Google, Meta, TikTok, and Shopify for onboarding and management purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>You may only connect accounts you own or are authorized to manage.</li>
                <li>You must provide accurate information.</li>
                <li>You remain responsible for securing your accounts.</li>
                <li>You may not misuse the App, including unauthorized access attempts.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Usage</h2>
              <p className="text-gray-700 mb-4">
                Your data is accessed only as described in our Privacy Policy. We request only the minimal API permissions necessary to verify ownership and list accounts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. No Warranty</h2>
              <p className="text-gray-700 mb-4">
                The App is provided "as is," without any warranties of any kind. We do not guarantee uninterrupted or error-free operation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, Vast Brands LLC shall not be liable for any damages resulting from your use of the App.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Changes</h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms at any time. Continued use of the App indicates acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, contact:
              </p>
              <p className="text-gray-700">
                📧 <a href="mailto:info@vastmediamarketing.co.uk" className="text-indigo-600 hover:text-indigo-800">
                  info@vastmediamarketing.co.uk
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
