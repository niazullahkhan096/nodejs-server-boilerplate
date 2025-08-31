import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError, getLanguageFromRequest } from '../utils/apiResponse';
import { env } from '../config';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const result = await AuthService.register({ email, password, name });

      // Set refresh token in cookie if enabled
      if (env.USE_COOKIES) {
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: env.COOKIE_SECURE,
          sameSite: env.COOKIE_SAME_SITE,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      const language = getLanguageFromRequest(req);
      sendSuccess(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: env.USE_COOKIES ? undefined : result.refreshToken,
      }, 'auth.register.success', 201, language);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login({ email, password });

      // Set refresh token in cookie if enabled
      if (env.USE_COOKIES) {
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: env.COOKIE_SECURE,
          sameSite: env.COOKIE_SAME_SITE,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      const language = getLanguageFromRequest(req);
      sendSuccess(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: env.USE_COOKIES ? undefined : result.refreshToken,
      }, 'auth.login.success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let refreshToken: string;

      if (env.USE_COOKIES) {
        refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          const language = getLanguageFromRequest(req);
          sendError(res, 'auth.token.invalid', 401, null, language);
          return;
        }
      } else {
        refreshToken = req.body.refreshToken;
        if (!refreshToken) {
          const language = getLanguageFromRequest(req);
          sendError(res, 'auth.token.invalid', 400, null, language);
          return;
        }
      }

      const result = await AuthService.refreshToken(refreshToken);

      // Set new refresh token in cookie if enabled
      if (env.USE_COOKIES) {
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: env.COOKIE_SECURE,
          sameSite: env.COOKIE_SAME_SITE,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      const language = getLanguageFromRequest(req);
      sendSuccess(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: env.USE_COOKIES ? undefined : result.refreshToken,
      }, 'auth.token.refresh_success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let refreshToken: string;

      if (env.USE_COOKIES) {
        refreshToken = req.cookies.refreshToken;
      } else {
        refreshToken = req.body.refreshToken;
      }

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Clear refresh token cookie if enabled
      if (env.USE_COOKIES) {
        res.clearCookie('refreshToken');
      }

      const language = getLanguageFromRequest(req);
      sendSuccess(res, null, 'auth.logout.success', 200, language);
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        const language = getLanguageFromRequest(req);
        sendError(res, 'unauthorized', 401, null, language);
        return;
      }

      const user = await AuthService.getCurrentUser(req.user.id);
      const language = getLanguageFromRequest(req);
      sendSuccess(res, user, 'user.list.success', 200, language);
    } catch (error) {
      next(error);
    }
  }
}
