import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeWrapper from "@/components/ThemeWrapper";
import Head from 'next/head';
import { Poppins } from "next/font/google";
import ConditionalFooter from "@/components/ConditionalFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Free Daily Motivation",
  description: "Privacy Policy for Free Daily Motivation. Learn how we collect, use, and protect your data when using our app and website.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function TermsAndPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Free Daily Motivation</title>
        <meta name="description" content="Privacy Policy for Free Daily Motivation. Learn how we collect, use, and protect your data." />
      </Head>
      <ThemeWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-start p-8">
            <h1 className={`${poppins.className} text-[32px] md:text-[42px] lg:text-[52px] font-bold mb-8 text-[rgb(51,51,51)] dark:text-white text-center`}>Privacy Policy</h1>
            <div className="max-w-4xl text-left space-y-6">
              

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>1. Introduction</h2>
                <p className="mb-4 dark:text-gray-300">
                  Welcome to Free Daily Motivation (the "App"). This Privacy Policy is provided by Miguel Macedo Parente ("we," "us," or "our"), the developer and operator of this application. We are committed to protecting your privacy and ensuring transparency about how we handle your data.
                </p>
                <p className="mb-4 dark:text-gray-300">
                  This Privacy Policy explains how we collect, use, share, and protect personal and sensitive user data when you use our mobile application and website at <Link href="https://www.freedailymotivation.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.freedailymotivation.com</Link>.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>2. Developer Information & Contact</h2>
                <p className="mb-4 dark:text-gray-300">
                  <strong>Developer/Company Name:</strong> Miguel Macedo Parente
                </p>
                <p className="mb-4 dark:text-gray-300">
                  <strong>Contact for Privacy Inquiries:</strong> You can contact us regarding privacy matters through:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li>Email: Available through our <Link href="https://www.linkedin.com/in/miguel-macedo-parente/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn profile</Link></li>
                  <li>Website: <Link href="https://www.freedailymotivation.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.freedailymotivation.com</Link></li>
                </ul>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>3. Information We Collect</h2>
                <p className="mb-4 dark:text-gray-300">
                  We collect the following types of information to provide and improve our services:
                </p>
                
                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>3.1 Personal Information</h3>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Account Information:</strong> When you create an account, we collect your email address, username, and authentication credentials through Clerk (our authentication provider).</li>
                  <li><strong>User Preferences:</strong> Your favorite quotes, selected categories, theme preferences (light/dark mode), and notification settings.</li>
                  <li><strong>Device Information:</strong> Device type, operating system version, unique device identifiers, and mobile network information.</li>
                </ul>

                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>3.2 Usage Data</h3>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Analytics Data:</strong> Through Google Analytics, we collect page views, navigation patterns, time spent on pages, and interaction with features.</li>
                  <li><strong>App Usage:</strong> Quotes viewed, searches performed, categories browsed, and features used within the app.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, app version, and crash reports for debugging purposes.</li>
                </ul>

                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>3.3 Push Notification Information</h3>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Notification Token:</strong> Device-specific push notification tokens collected through OneSignal to send daily motivational quotes.</li>
                  <li><strong>Notification Preferences:</strong> Your settings for receiving notifications, including time preferences and frequency.</li>
                </ul>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>4. How We Use Your Information</h2>
                <p className="mb-4 dark:text-gray-300">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Service Delivery:</strong> To provide you with inspirational quotes, manage your account, and enable core app functionality.</li>
                  <li><strong>Personalization:</strong> To save your favorite quotes, remember your theme preferences, and customize your experience.</li>
                  <li><strong>Notifications:</strong> To send you daily motivational quotes if you've opted in to push notifications.</li>
                  <li><strong>Analytics & Improvement:</strong> To understand how users interact with our app, identify bugs, and improve features.</li>
                  <li><strong>Authentication:</strong> To verify your identity and secure your account through Clerk authentication services.</li>
                  <li><strong>Communication:</strong> To respond to your inquiries and provide customer support.</li>
                </ul>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>5. How We Share Your Information</h2>
                <p className="mb-4 dark:text-gray-300">
                  We share your information with the following third-party service providers to operate our app:
                </p>
                
                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>5.1 Third-Party Services</h3>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li>
                    <strong>Clerk (Authentication Service):</strong> Processes and stores your email address and authentication credentials to manage user accounts and authentication.
                    <br />Privacy Policy: <Link href="https://clerk.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://clerk.com/privacy</Link>
                  </li>
                  <li>
                    <strong>Supabase (Database Service):</strong> Stores your favorite quotes, user preferences, and app data.
                    <br />Privacy Policy: <Link href="https://supabase.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</Link>
                  </li>
                  <li>
                    <strong>Google Analytics:</strong> Collects anonymous usage statistics and analytics data to help us understand app usage patterns.
                    <br />Privacy Policy: <Link href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</Link>
                  </li>
                  <li>
                    <strong>OneSignal (Push Notifications):</strong> Manages and delivers push notifications for daily motivational quotes.
                    <br />Privacy Policy: <Link href="https://onesignal.com/privacy_policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://onesignal.com/privacy_policy</Link>
                  </li>
                  <li>
                    <strong>Vercel (Hosting Provider):</strong> Hosts our web application and processes server requests.
                    <br />Privacy Policy: <Link href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://vercel.com/legal/privacy-policy</Link>
                  </li>
                </ul>

                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>5.2 Legal Requirements</h3>
                <p className="mb-4 dark:text-gray-300">
                  We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
                </p>

                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>5.3 No Sale of Data</h3>
                <p className="mb-4 dark:text-gray-300">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>6. Data Security</h2>
                <p className="mb-4 dark:text-gray-300">
                  We implement industry-standard security measures to protect your personal and sensitive information:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using HTTPS/SSL protocols.</li>
                  <li><strong>Authentication Security:</strong> User authentication is managed through Clerk, which implements secure authentication practices including password hashing and secure token management.</li>
                  <li><strong>Database Security:</strong> Your data is stored in Supabase with row-level security policies and encrypted at rest.</li>
                  <li><strong>Access Controls:</strong> We limit access to personal information to authorized personnel who need it to operate, develop, or improve our app.</li>
                  <li><strong>Regular Updates:</strong> We regularly update our security practices and software dependencies to protect against vulnerabilities.</li>
                </ul>
                <p className="mb-4 dark:text-gray-300">
                  While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>7. Data Retention and Deletion</h2>
                
                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>7.1 Retention Period</h3>
                <p className="mb-4 dark:text-gray-300">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after account deletion.</li>
                  <li><strong>Usage Analytics:</strong> Anonymized analytics data may be retained indefinitely for statistical purposes.</li>
                  <li><strong>Logs and Technical Data:</strong> Retained for up to 90 days for debugging and security purposes.</li>
                </ul>

                <h3 className={`${poppins.className} text-[18px] md:text-[22px] font-bold mb-3 text-[rgb(51,51,51)] dark:text-white`}>7.2 Deletion Policy</h3>
                <p className="mb-4 dark:text-gray-300">
                  You have the right to request deletion of your personal data at any time:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Account Deletion:</strong> You can delete your account through the app settings or by contacting us directly.</li>
                  <li><strong>Data Removal:</strong> Upon account deletion, we will remove your personal information from our active databases within 30 days.</li>
                  <li><strong>Backup Copies:</strong> Data may remain in backup systems for up to 90 days before permanent deletion.</li>
                  <li><strong>Legal Obligations:</strong> We may retain certain information if required by law or for legitimate business purposes (e.g., fraud prevention).</li>
                </ul>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>8. Your Privacy Rights</h2>
                <p className="mb-4 dark:text-gray-300">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information.</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
                  <li><strong>Opt-Out:</strong> Opt out of push notifications through your device settings or app preferences.</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent is the legal basis.</li>
                </ul>
                <p className="mb-4 dark:text-gray-300">
                  To exercise any of these rights, please contact us using the information provided in Section 2 above.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>9. Children's Privacy</h2>
                <p className="mb-4 dark:text-gray-300">
                  Our app is intended for a general audience and is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
                </p>
                <p className="mb-4 dark:text-gray-300">
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us using the information in Section 2.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>10. International Data Transfers</h2>
                <p className="mb-4 dark:text-gray-300">
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>
                <p className="mb-4 dark:text-gray-300">
                  Our third-party service providers (Clerk, Supabase, Google Analytics, OneSignal, Vercel) may store and process data in various locations including the United States and European Union.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>11. Changes to This Privacy Policy</h2>
                <p className="mb-4 dark:text-gray-300">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li>Update the "Last Updated" date at the top of this policy.</li>
                  <li>Notify you through the app or via email if the changes are significant.</li>
                  <li>Obtain your consent if required by applicable law.</li>
                </ul>
                <p className="mb-4 dark:text-gray-300">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>12. Cookie Policy</h2>
                <p className="mb-4 dark:text-gray-300">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for authentication and app functionality.</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our app through Google Analytics.</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., theme selection).</li>
                </ul>
                <p className="mb-4 dark:text-gray-300">
                  You can control cookies through your browser settings, but disabling certain cookies may affect app functionality.
                </p>
              </section>

              <section>
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>13. Terms of Service</h2>
                <p className="mb-4 dark:text-gray-300">
                  By using Free Daily Motivation, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside mb-4 dark:text-gray-300 ml-4">
                  <li>You will use the app in compliance with all applicable laws and regulations.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>The quotes provided are for motivational and inspirational purposes only.</li>
                  <li>We reserve the right to modify, suspend, or discontinue any part of the app at any time.</li>
                  <li>We are not liable for any damages arising from your use of the app.</li>
                </ul>
              </section>

              <section className="border-t pt-6 mt-8">
                <h2 className={`${poppins.className} text-[24px] md:text-[28px] font-bold mb-4 text-[rgb(51,51,51)] dark:text-white`}>14. Contact Us</h2>
                <p className="mb-4 dark:text-gray-300">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="dark:text-gray-300 mb-2">
                    <strong>Vibe coder:</strong> Miguel Macedo Parente
                  </p>
                  <p className="dark:text-gray-300 mb-2">
                    <strong>Website:</strong> <Link href="https://www.freedailymotivation.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.freedailymotivation.com</Link>
                  </p>
                  <p className="dark:text-gray-300">
                    <strong>LinkedIn:</strong> <Link href="https://www.linkedin.com/in/miguel-macedo-parente/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Miguel Macedo Parente</Link>
                  </p>
                </div>
                <p className="mb-4 dark:text-gray-300">
                  We will respond to your inquiry within 30 days.
                </p>
              </section>

              <section className="text-center mt-8 pt-6 border-t">
                <p className="text-sm dark:text-gray-400 mb-4">
                  This Privacy Policy is effective as of October 31, 2025, and applies to all users of Free Daily Motivation.
                </p>
              </section>

            </div>
            <div className="mt-8">
              <Link href="/about">
                <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444] mr-4">Back to About</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" className="dark:bg-[#333] dark:text-white dark:hover:bg-[#444]">Back to Home Page</Button>
              </Link>
            </div>
          </main>
          <ConditionalFooter />
        </div>
      </ThemeWrapper>
    </>
  );
}

