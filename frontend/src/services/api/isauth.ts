/**
 * @deprecated Use authService.checkAuth() instead
 * This file is kept for backward compatibility
 */

import { authService } from '../authService';

export async function isauth(): Promise<boolean> {
	return await authService.checkAuth();
}