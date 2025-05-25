import { Metadata } from "next"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "About GalleryHub - Our Story & Mission",
  description: "Learn about GalleryHub's mission to connect artists and art enthusiasts in a modern digital gallery platform.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
          About GalleryHub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Bridging the gap between artists and art enthusiasts through technology and innovation.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            At GalleryHub, we believe that art should be accessible to everyone. Our mission is to create a vibrant, 
            inclusive platform where artists can showcase their work to a global audience and art enthusiasts can 
            discover and connect with exceptional artwork.
          </p>
          <p className="text-muted-foreground">
            We're committed to fostering a community that celebrates creativity, supports artists, and makes art 
            appreciation more accessible in the digital age.
          </p>
        </div>
        <div className="bg-muted rounded-lg p-8">
          <h3 className={`${playfair.className} text-2xl font-bold mb-4`}>What We Offer</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Digital exhibition spaces for artists</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Curated collections and virtual galleries</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Artist profiles and portfolios</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Art discovery and exploration tools</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Community engagement features</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className={`${playfair.className} text-3xl font-bold text-center mb-12`}>Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className={`${playfair.className} text-xl font-bold mb-3`}>Accessibility</h3>
            <p className="text-muted-foreground">
              Making art accessible to everyone, regardless of location or background.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className={`${playfair.className} text-xl font-bold mb-3`}>Innovation</h3>
            <p className="text-muted-foreground">
              Continuously evolving our platform with cutting-edge technology and features.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className={`${playfair.className} text-xl font-bold mb-3`}>Community</h3>
            <p className="text-muted-foreground">
              Building a supportive and engaged community of artists and art lovers.
            </p>
          </div>
        </div>
      </div>

      {/* Join Section */}
      <div className="text-center bg-muted rounded-lg p-12">
        <h2 className={`${playfair.className} text-3xl font-bold mb-4`}>Join Our Community</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you're an artist looking to showcase your work or an art enthusiast seeking to discover 
          new talent, GalleryHub is the perfect platform for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Get Started
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
} 