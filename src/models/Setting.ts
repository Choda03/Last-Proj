import mongoose, { Document } from "mongoose"

export interface ISetting extends Document {
  allowNewRegistrations: boolean
  requireEmailVerification: boolean
  allowArtworkUploads: boolean
  requireArtworkApproval: boolean
  maxArtworksPerUser: number
  maxFileSizeMB: number
  allowedFileTypes: string[]
  maintenanceMode: boolean
  maintenanceMessage: string
  updatedAt: Date
}

const settingSchema = new mongoose.Schema<ISetting>(
  {
    allowNewRegistrations: {
      type: Boolean,
      required: true,
      default: true,
    },
    requireEmailVerification: {
      type: Boolean,
      required: true,
      default: true,
    },
    allowArtworkUploads: {
      type: Boolean,
      required: true,
      default: true,
    },
    requireArtworkApproval: {
      type: Boolean,
      required: true,
      default: true,
    },
    maxArtworksPerUser: {
      type: Number,
      required: true,
      default: 50,
      min: 1,
      max: 1000,
    },
    maxFileSizeMB: {
      type: Number,
      required: true,
      default: 10,
      min: 1,
      max: 100,
    },
    allowedFileTypes: {
      type: [String],
      required: true,
      default: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    },
    maintenanceMode: {
      type: Boolean,
      required: true,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      required: true,
      default: "The platform is currently under maintenance. Please check back later.",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
)

// Ensure only one settings document exists
settingSchema.pre("save", async function (next) {
  const count = await mongoose.models.Setting?.countDocuments()
  if (count > 0 && this.isNew) {
    throw new Error("Only one settings document can exist")
  }
  next()
})

export const Setting =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", settingSchema) 