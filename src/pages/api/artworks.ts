import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { Artwork } from '@/models/Artwork';
import { User } from '@/models/User';
import formidable, { File as FormidableFile } from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("COOKIES:", req.headers.cookie);
  if (req.method === 'GET') {
    await dbConnect();
    const { userId } = req.query;
    let query = {};
    if (userId) query = { artist: userId };
    const artworks = await Artwork.find(query).sort({ createdAt: -1 });
    return res.status(200).json(artworks);
  }
  if (req.method === 'POST' && req.url?.includes('/like')) {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing artwork id' });
    }
    const user = await User.findById(token.id);
    const artwork = await Artwork.findById(id);
    if (!user || !artwork) {
      return res.status(404).json({ error: 'User or artwork not found' });
    }
    const alreadyLiked = user.likedArtworks.some((artId: any) => artId.toString() === id);
    if (alreadyLiked) {
      // Unlike
      user.likedArtworks = user.likedArtworks.filter((artId: any) => artId.toString() !== id);
      artwork.likes = Math.max((artwork.likes || 1) - 1, 0);
      await user.save();
      await artwork.save();
      return res.status(200).json({ liked: false, likes: artwork.likes });
    } else {
      // Like
      user.likedArtworks.push(artwork._id);
      artwork.likes = (artwork.likes || 0) + 1;
      await user.save();
      await artwork.save();
      return res.status(200).json({ liked: true, likes: artwork.likes });
    }
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("TOKEN:", token);
  if (!token?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'File upload error' });
    const { title, description, category, tags } = fields;
    const file = files.image;
    if (!title || !description || !category || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Fix typing for formidable file
    const fileObj = Array.isArray(file) ? file[0] : file;
    const filePath = '/uploads/' + path.basename((fileObj as FormidableFile).filepath);
    const user = await User.findById(token.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const artwork = await Artwork.create({
      title: Array.isArray(title) ? title[0] : title,
      description: Array.isArray(description) ? description[0] : description,
      imageUrl: filePath,
      category: Array.isArray(category) ? category[0] : category,
      tags: tags ? (Array.isArray(tags) ? tags[0] : tags).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      artist: user._id,
      isPublic: true,
    });
    return res.status(200).json({ message: 'Artwork uploaded successfully', artwork });
  });
} 