import { z } from 'zod';

const schema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SESSION_SECRET: z.string().default('some-secret'),
  SESSION_MAX_AGE: z.string().default('86400'),
  BCRYPT_SALT_ROUNDS: z.string().default('10'),
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env);
  if (parsed.success === false) {
    console.log('Invalid env variables', parsed.error.flatten().fieldErrors);
    // Move the throw statement here so it only runs on failure
    throw new Error('Invalid environment variables');
  }
}

export default () => ({
  port: parseInt(process.env.PORT, 10),
  nodeEnv: process.env.NODE_ENV,
  session: {
    secret: process.env.SESSION_SECRET,
    maxAge: parseInt(process.env.SESSION_MAX_AGE, 10),
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },
});
