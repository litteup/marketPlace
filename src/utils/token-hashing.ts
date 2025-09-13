import * as bcrypt from 'bcrypt';

/**
 * Compares a plain-text token with a hashed token.
 * @param token The plain-text token from the request.
 * @param hashedToken The hashed token from the database.
 * @returns A boolean indicating if the tokens match.
 */
export async function comparePasswordResetToken(
  token: string,
  hashedToken: string,
): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}
