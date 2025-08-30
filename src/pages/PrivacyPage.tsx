import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy for Vast Onboarding Platform</h1>
          
          <div className="text-sm text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Who we are</h2>
              <p className="text-gray-700 mb-4">
                The Vast Onboarding Platform ("the App") is operated by Vast Brands LLC. You can reach us at{' '}
                <a href="mailto:info@vastmediamarketing.co.uk" className="text-indigo-600 hover:text-indigo-800">
                  info@vastmediamarketing.co.uk
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Data we collect</h2>
              <p className="text-gray-700 mb-4">
                When you connect your accounts through the App, we receive limited information via official APIs from Google, Meta, TikTok, and Shopify. The data collected is limited to account identifiers, metadata, and other information strictly necessary to verify ownership and list assets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How we use your data</h2>
              <p className="text-gray-700 mb-4">We use this information only to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>Allow you to connect your business accounts (Google, Meta, TikTok, Shopify).</li>
                <li>Display your connected accounts in the App.</li>
                <li>Verify ownership and configuration of those accounts.</li>
                <li>Provide a unified onboarding experience.</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We do not sell, rent, or share your data with third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Platform-specific data collection and use</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Google APIs</h3>
                <p className="text-gray-700 mb-3">
                  We request access to the following Google APIs and scopes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1 ml-4">
                  <li><strong>Google Ads API:</strong> https://www.googleapis.com/auth/adwords – list Google Ads accounts.</li>
                  <li><strong>Google Analytics Admin + Data API:</strong> https://www.googleapis.com/auth/analytics.readonly – list GA4 accounts/properties and display a simple read-only report.</li>
                  <li><strong>Google Tag Manager API:</strong> https://www.googleapis.com/auth/tagmanager.readonly – list GTM accounts and containers.</li>
                  <li><strong>Google Search Console API:</strong> https://www.googleapis.com/auth/webmasters.readonly – list verified websites.</li>
                  <li><strong>Google Business Profile API:</strong> https://www.googleapis.com/auth/business.manage – list business locations.</li>
                  <li><strong>Google Merchant API (Content API for Shopping):</strong> https://www.googleapis.com/auth/content – list Merchant Center accounts.</li>
                </ul>
                <p className="text-gray-700 mb-3">
                  <strong>Use:</strong> All data is read-only unless no read-only scope exists (GBP, Merchant). We do not edit or modify assets.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Revocation:</strong> You may revoke access anytime via your Google Security Settings.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Meta APIs (Facebook & Instagram)</h3>
                <p className="text-gray-700 mb-3">
                  We request access to the following Meta APIs and scopes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1 ml-4">
                  <li><strong>Marketing API:</strong> ads_read, business_management – list Ad Accounts, Catalogs, Datasets.</li>
                  <li><strong>Pages API:</strong> pages_show_list, pages_read_engagement – list and verify Facebook Pages.</li>
                  <li><strong>Instagram Graph API:</strong> instagram_basic – verify linked Instagram Business accounts.</li>
                </ul>
                <p className="text-gray-700 mb-3">
                  <strong>Use:</strong> Access is limited to listing and verifying assets; we do not post or manage content.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Revocation:</strong> You may revoke access anytime via your Facebook Business Settings.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">TikTok APIs</h3>
                <p className="text-gray-700 mb-3">
                  We request access to the following TikTok Business APIs:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1 ml-4">
                  <li><strong>Business Assets API</strong> – list Advertiser Accounts, Catalogs, Pixels, and Audiences.</li>
                  <li><strong>Advertiser API</strong> – read access to advertiser accounts.</li>
                </ul>
                <p className="text-gray-700 mb-3">
                  <strong>Use:</strong> Data is used only to list and verify connected advertiser assets. We do not post content or manage campaigns.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Revocation:</strong> You may revoke access anytime via your TikTok Business Center.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Shopify</h3>
                <p className="text-gray-700 mb-3">
                  The App requests collaborator access to your Shopify store using your Store ID and Collaborator Code.
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Permissions requested:</strong> Orders, Products, Customers, Apps & Channels, and Store Settings.
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Use:</strong> Data is accessed only to verify store connection and provide onboarding support.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Revocation:</strong> You may revoke collaborator access anytime in Shopify Admin → Users and Permissions.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data storage & security</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
                <li>OAuth tokens and collaborator codes are stored securely, encrypted in transit and at rest.</li>
                <li>No raw credentials are shared with third parties.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Children's privacy</h2>
              <p className="text-gray-700 mb-4">
                The App is not directed to children under 13 and does not knowingly collect personal data from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, contact us at:
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
