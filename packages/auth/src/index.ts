export { generateTokenPair, verifyAccessToken, verifyRefreshToken, decodeToken } from './jwt';
export type { TokenPayload, TokenPair } from './jwt';

export { getRoleLevel, hasMinimumRole, isPatient, isClinical, isAdmin } from './roles';

export {
  hasPermission,
  getPermittedActions,
  Resource,
  Action,
} from './permissions';

export type { AuthenticatedUser, AuthConfig } from './types';
export { DEFAULT_AUTH_CONFIG } from './types';
