import * as bcrypt from 'bcrypt';

/**
 * Hashes a password or token before storing it in the database.
 * @param password The plain-text password.
 * @returns The hashed password.
 */
export async function getPasswordHash(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
  const rounds = isNaN(saltRounds) ? 10 : saltRounds;
  return bcrypt.hash(password, rounds);
}
