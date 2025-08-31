import mongoose, { Document } from 'mongoose';
export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    jti: string;
    expiresAt: Date;
    revokedAt?: Date;
    userAgent?: string;
    ip?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IRefreshToken, {}, {}, {}, mongoose.Document<unknown, {}, IRefreshToken, {}, {}> & IRefreshToken & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=RefreshToken.d.ts.map