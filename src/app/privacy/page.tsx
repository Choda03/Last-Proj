import { Metadata } from "next"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Privacy Policy - GalleryHub",
  description: "Learn how GalleryHub collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          Privacy Policy
        </h1>
        <p className="text-xl text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Introduction</h2>
          <p>
            At GalleryHub, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our digital art gallery platform. 
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the platform.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create an account</li>
            <li>Upload artwork</li>
            <li>Make purchases</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact our support team</li>
          </ul>
          <p className="mt-4">This information may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Billing and payment information</li>
            <li>Profile information and preferences</li>
            <li>Artwork and portfolio content</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process transactions and manage your account</li>
            <li>Send you updates and marketing communications</li>
            <li>Improve our platform and user experience</li>
            <li>Comply with legal obligations</li>
            <li>Protect against fraud and unauthorized access</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal 
            information. However, no method of transmission over the Internet or electronic storage is 100% 
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Your Rights</h2>
          <p>Under applicable data protection laws, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and store 
            certain information. You can instruct your browser to refuse all cookies or to indicate when 
            a cookie is being sent.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Third-Party Services</h2>
          <p>
            We may use third-party services that collect, monitor, and analyze data. These third parties 
            have their own privacy policies addressing how they use such information.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Children's Privacy</h2>
          <p>
            Our platform is not intended for use by children under the age of 13. We do not knowingly 
            collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">GalleryHub</p>
            <p>Email: privacy@galleryhub.com</p>
            <p>Address: 123 Art Street, Creative District, New York, NY 10001</p>
          </div>
        </section>
      </div>
    </div>
  )
} 