import jwt from 'jsonwebtoken';
import { env } from '../config';
import { hashToken, compareToken, generateJti } from '../utils/crypto';
import RefreshToken from '../models/RefreshToken';
import { ApiError } from '../middleware/error';
import { httpStatus } from '../utils/httpStatus';

interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXP,
    } as any);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXP,
      jwtid: generateJti(),
    } as any);
  }

  static async saveRefreshToken(
    userId: string,
    token: string,
    userAgent?: string,
    ip?: string
  ): Promise<void> {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const tokenHash = await hashToken(token);

    await RefreshToken.create({
      userId,
      tokenHash,
      jti: decoded.jti,
      expiresAt: new Date(decoded.exp! * 1000),
      userAgent,
      ip,
    });
  }

  static async verifyRefreshToken(token: string): Promise<{ payload: TokenPayload; jti: string }> {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload & TokenPayload;
      
      // Check if token exists and is not revoked
      const refreshToken = await RefreshToken.findOne({
        jti: decoded.jti,
        revokedAt: null,
      });

      if (!refreshToken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found or revoked');
      }

      // Verify token hash
      const isValid = await compareToken(token, refreshToken.tokenHash);
      if (!isValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
      }

      // Check if token is expired
      if (new Date() > refreshToken.expiresAt) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token expired');
      }

      return {
        payload: {
          userId: decoded.userId,
          email: decoded.email,
          roles: decoded.roles,
          permissions: decoded.permissions,
        },
        jti: decoded.jti || '',
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
      }
      throw error;
    }
  }

  static async revokeRefreshToken(jti: string): Promise<void> {
    await RefreshToken.findOneAndUpdate(
      { jti, revokedAt: null },
      { revokedAt: new Date() }
    );
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() }
    );
  }
}
