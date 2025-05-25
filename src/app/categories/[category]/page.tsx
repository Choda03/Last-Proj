import { notFound } from 'next/navigation';

const categories = [
  'painting',
  'photography',
  'sculpture',
  'digital-art',
  'illustration',
];

export function generateStaticParams() {
  return categories.map(category => ({ category }));
}

// Custom type for the dynamic route page props (params is a plain object, not a Promise)
type PageProps = { params: { category: string } };

export default function Page({ params }: PageProps) {
  const category = params.category;

  if (!categories.includes(category)) {
    notFound();
  }

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4 capitalize">{category.replace('-', ' ')}</h1>
      <p className="text-lg text-muted-foreground">Explore artworks in the {category.replace('-', ' ')} category.</p>
    </div>
  );
} 