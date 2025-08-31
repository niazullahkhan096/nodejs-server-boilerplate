import mongoose, { Document } from 'mongoose';
export interface IPermission extends Document {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, {}> & IPermission & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Permission.d.ts.map