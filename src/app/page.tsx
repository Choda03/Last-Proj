import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover & Share Beautiful Artwork
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join our community of artists and art enthusiasts. Share your work, discover amazing pieces, and connect with fellow creators.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                >
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/90"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
                  alt="Gallery Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg shadow-xl object-cover"
                  priority
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                    <p className="text-white/80">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 shadow-lg"
              >
                <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="rounded-full object-cover"
                      quality={85}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const categories = [
  {
    name: 'Photography',
    slug: 'photography',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    description: 'Capture moments and share your perspective',
  },
  {
    name: 'Digital Art',
    slug: 'digital-art',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore the world of digital creativity',
  },
  {
    name: 'Traditional Art',
    slug: 'traditional-art',
    image: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80',
    description: 'Classic techniques and timeless masterpieces',
  },
  {
    name: 'Sculpture',
    slug: 'sculpture',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
    description: 'Three-dimensional artistic expressions',
  },
  {
    name: 'Illustration',
    slug: 'illustration',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
    description: 'Creative visual storytelling',
  },
  {
    name: 'Painting',
    slug: 'painting',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
    description: 'Expressive brushwork and colors',
  }
]

const testimonials = [
  {
    content: "Gallery Hub has transformed how I share my artwork. The community is incredibly supportive and the platform is a joy to use.",
    name: "Sarah Johnson",
    role: "Digital Artist",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg?w=96&h=96&q=80",
  },
  {
    content: "As a photographer, I love how easy it is to showcase my work and connect with other artists. The interface is intuitive and beautiful.",
    name: "Michael Chen",
    role: "Photographer",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg?w=96&h=96&q=80",
  },
  {
    content: "The best platform for artists I've found. The features are exactly what I needed to grow my audience and share my passion.",
    name: "Emma Davis",
    role: "Traditional Artist",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg?w=96&h=96&q=80",
  },
] 