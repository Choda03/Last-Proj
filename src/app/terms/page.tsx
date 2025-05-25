import { Metadata } from "next"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terms of Service - GalleryHub",
  description: "Read GalleryHub's terms of service and user agreement for our digital art gallery platform.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          Terms of Service
        </h1>
        <p className="text-xl text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>1. Agreement to Terms</h2>
          <p>
            By accessing or using GalleryHub, you agree to be bound by these Terms of Service and all 
            applicable laws and regulations. If you do not agree with any of these terms, you are 
            prohibited from using or accessing this platform.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>2. Use License</h2>
          <p>
            Permission is granted to temporarily access GalleryHub for personal, non-commercial viewing 
            purposes only. This is the grant of a license, not a transfer of title, and under this license 
            you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on GalleryHub</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>3. User Accounts</h2>
          <p>
            To access certain features of GalleryHub, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Promptly update any changes to your information</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>4. Content Guidelines</h2>
          <p>
            When uploading content to GalleryHub, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Only upload content you own or have rights to</li>
            <li>Not upload content that is illegal, harmful, or offensive</li>
            <li>Not infringe on intellectual property rights</li>
            <li>Not upload content that contains malware or harmful code</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>5. Intellectual Property</h2>
          <p>
            The content on GalleryHub, including but not limited to text, graphics, logos, images, and 
            software, is the property of GalleryHub or its content suppliers and is protected by 
            international copyright laws.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>6. Purchases and Payments</h2>
          <p>
            When making purchases on GalleryHub:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>All prices are in the currency specified on the platform</li>
            <li>Payment must be made through approved payment methods</li>
            <li>Sales are final unless otherwise specified</li>
            <li>We reserve the right to refuse any transaction</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>7. Disclaimer</h2>
          <p>
            GalleryHub is provided "as is." We make no warranties, expressed or implied, and hereby 
            disclaim and negate all other warranties, including without limitation, implied warranties 
            or conditions of merchantability, fitness for a particular purpose, or non-infringement of 
            intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>8. Limitations</h2>
          <p>
            In no event shall GalleryHub or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising out 
            of the use or inability to use GalleryHub.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>9. Revisions and Errata</h2>
          <p>
            The materials appearing on GalleryHub could include technical, typographical, or photographic 
            errors. We do not warrant that any of the materials are accurate, complete, or current. We 
            may make changes to the materials at any time without notice.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>10. Links</h2>
          <p>
            GalleryHub has not reviewed all of the sites linked to its platform and is not responsible 
            for the contents of any such linked site. The inclusion of any link does not imply endorsement 
            by GalleryHub of the site.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>11. Modifications</h2>
          <p>
            We may revise these terms of service at any time without notice. By using GalleryHub, you are 
            agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>12. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the 
            United States and you irrevocably submit to the exclusive jurisdiction of the courts in that 
            location.
          </p>
        </section>

        <section className="mb-12">
          <h2 className={`${playfair.className} text-2xl font-bold mb-4`}>Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at:
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">GalleryHub</p>
            <p>Email: legal@galleryhub.com</p>
            <p>Address: 123 Art Street, Creative District, New York, NY 10001</p>
          </div>
        </section>
      </div>
    </div>
  )
} 