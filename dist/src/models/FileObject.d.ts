import mongoose, { Document } from 'mongoose';
export interface IFileObject extends Document {
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
}
declare const _default: mongoose.Model<IFileObject, {}, {}, {}, mongoose.Document<unknown, {}, IFileObject, {}, {}> & IFileObject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=FileObject.d.ts.map