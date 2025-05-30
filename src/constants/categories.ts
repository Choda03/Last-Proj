import { Palette, Camera, Brush, Pencil, Scissors, Image as ImageIcon, Users } from "lucide-react";

export const categories = [
  {
    id: "abstract",
    title: "Abstract Art",
    description: "Explore non-representational artwork that uses shapes, colors, and forms to achieve its effect.",
    icon: Palette,
    image: "https://source.unsplash.com/random/800x600?abstract-art",
    count: 1234,
  },
  {
    id: "photography",
    title: "Photography",
    description: "Discover stunning photographs capturing moments, landscapes, and artistic expressions.",
    icon: Camera,
    image: "https://source.unsplash.com/random/800x600?photography",
    count: 2156,
  },
  {
    id: "painting",
    title: "Painting",
    description: "View traditional and contemporary paintings in various styles and techniques.",
    icon: Brush,
    image: "https://source.unsplash.com/random/800x600?painting",
    count: 3421,
  },
  {
    id: "drawing",
    title: "Drawing",
    description: "Explore sketches, illustrations, and drawings in different mediums.",
    icon: Pencil,
    image: "https://source.unsplash.com/random/800x600?drawing",
    count: 1876,
  },
  {
    id: "digital",
    title: "Digital Art",
    description: "Discover artwork created using digital technology and tools.",
    icon: ImageIcon,
    image: "https://source.unsplash.com/random/800x600?digital-art",
    count: 2987,
  },
  {
    id: "sculpture",
    title: "Sculpture",
    description: "View three-dimensional artworks created by shaping or combining materials.",
    icon: Scissors,
    image: "https://source.unsplash.com/random/800x600?sculpture",
    count: 945,
  },
  {
    id: "portrait",
    title: "Portrait",
    description: "Explore artistic representations of people, capturing their likeness and personality.",
    icon: Users,
    image: "https://source.unsplash.com/random/800x600?portrait",
    count: 1678,
  },
]; 