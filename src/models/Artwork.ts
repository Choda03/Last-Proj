import mongoose, { Document } from "mongoose"

export interface IArtwork extends Document {
  title: string
  description: string
  imageUrl: string
  artist: mongoose.Types.ObjectId
  category: "painting" | "photography" | "digital" | "sculpture" | "other"
  tags: string[]
  views: number
  likes: number
  status: "pending" | "approved" | "rejected"
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const artworkSchema = new mongoose.Schema<IArtwork>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an artist"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: {
        values: ["painting", "photography", "digital", "sculpture", "other"],
        message: "Please provide a valid category",
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Please provide a valid status",
      },
      default: "pending",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
artworkSchema.index({ artist: 1 })
artworkSchema.index({ category: 1 })
artworkSchema.index({ tags: 1 })

export const Artwork =
  mongoose.models.Artwork || mongoose.model<IArtwork>("Artwork", artworkSchema) 