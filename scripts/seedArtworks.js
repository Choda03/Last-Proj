const dbConnect = require('../src/lib/mongodb').default;
const { Artwork } = require('../src/models/Artwork');
const { User } = require('../src/models/User');

async function seedArtworks() {
  try {
    await dbConnect();

    // Find a user to assign as artist, or create a placeholder
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Demo Artist',
        email: 'demo-artist@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
        emailVerified: true,
      });
    }

    const sampleArtworks = [
      {
        title: 'Sunset Overdrive',
        description: 'A vibrant sunset over the city skyline.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        category: 'photography',
        tags: ['sunset', 'city', 'skyline'],
      },
      {
        title: 'Abstract Dreams',
        description: 'Colorful abstract painting with bold strokes.',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        category: 'digital',
        tags: ['abstract', 'colorful', 'painting'],
      },
      {
        title: 'Mountain Majesty',
        description: 'Snow-capped mountains under a clear blue sky.',
        imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
        category: 'photography',
        tags: ['mountain', 'nature', 'snow'],
      },
      {
        title: 'Urban Jungle',
        description: 'A digital art piece blending city and nature.',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        category: 'digital',
        tags: ['urban', 'nature', 'digital'],
      },
      {
        title: 'Serenity',
        description: 'A peaceful lake surrounded by trees.',
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        category: 'photography',
        tags: ['lake', 'serene', 'trees'],
      },
      {
        title: 'Color Splash',
        description: 'An explosion of colors in this abstract piece.',
        imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
        category: 'painting',
        tags: ['abstract', 'color', 'explosion'],
      },
      {
        title: 'Portrait of a Lady',
        description: 'A classic portrait painting.',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        category: 'painting',
        tags: ['portrait', 'classic', 'lady'],
      },
      {
        title: 'Digital Mirage',
        description: 'Surreal digital art with vibrant hues.',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        category: 'digital',
        tags: ['surreal', 'mirage', 'digital'],
      },
      {
        title: 'Forest Path',
        description: 'A winding path through a dense forest.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        category: 'photography',
        tags: ['forest', 'path', 'nature'],
      },
      {
        title: 'Modern Sculpture',
        description: 'A striking modern sculpture in a city plaza.',
        imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
        category: 'sculpture',
        tags: ['sculpture', 'modern', 'art'],
      },
      {
        title: 'Blue Horizon',
        description: 'A minimalist painting of the sea and sky.',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        category: 'painting',
        tags: ['minimalist', 'sea', 'sky'],
      },
      {
        title: 'City Lights',
        description: 'Night view of a city illuminated by lights.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        category: 'photography',
        tags: ['city', 'night', 'lights'],
      },
      {
        title: 'Golden Fields',
        description: 'Fields of wheat glowing in the golden hour.',
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        category: 'photography',
        tags: ['fields', 'wheat', 'golden'],
      },
      {
        title: 'Urban Geometry',
        description: 'Geometric patterns in urban architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        category: 'digital',
        tags: ['geometry', 'urban', 'architecture'],
      },
      {
        title: 'Dreamscape',
        description: 'A dreamy, colorful digital landscape.',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        category: 'digital',
        tags: ['dream', 'colorful', 'landscape'],
      },
    ];

    await Artwork.deleteMany({}); // Optional: clear existing artworks
    for (const art of sampleArtworks) {
      await Artwork.create({
        ...art,
        artist: user._id,
        isPublic: true,
        status: 'approved',
        likes: 0,
        views: 0,
      });
    }
    console.log('Seeded 15 sample artworks!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seedArtworks:', err);
    process.exit(1);
  }
}

seedArtworks().catch((err) => {
  console.error('Top-level error:', err);
  process.exit(1);
}); 