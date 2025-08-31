import mongoose, { Document, Schema } from 'mongoose';

export interface IFileObject extends Document {
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  owner: mongoose.Types.ObjectId;
  category?: string; // Optional category for file organization
  createdAt: Date;
}

const fileObjectSchema = new Schema<IFileObject>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['profile-image', 'document', 'media', 'other'],
      default: 'other',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for faster queries
fileObjectSchema.index({ owner: 1 });
fileObjectSchema.index({ createdAt: 1 });
fileObjectSchema.index({ key: 1 });

export default mongoose.model<IFileObject>('FileObject', fileObjectSchema);
