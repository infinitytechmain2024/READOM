// Local in-browser database (IndexedDB). Temporary stand-in for the backend.
//
// Usage:
//   import { registerUser, authenticateUser, startSession } from '@/integrations/localdb';

export {
  registerUser,
  authenticateUser,
  findUser,
  listUsers,
  EmailTakenError,
  InvalidCredentialsError,
  type User,
  type RegisterInput,
} from './users';

export { startSession, endSession, getCurrentUser } from './session';
