/**
 * MongoDB Database Connection Manager
 * Supports connection caching across Next.js Serverless runtime
 */

export interface DbConfig {
  uri: string;
}

export function getDatabaseUri(): string {
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/storepilot';
}
