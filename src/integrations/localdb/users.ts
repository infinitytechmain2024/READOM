// User accounts stored in the local database.

import { getRecord, putRecord, getAllRecords } from './db';
import { hashPassword, verifyPassword, type PasswordHash } from './crypto';

// Stored shape (includes the password digest — never expose this directly).
interface UserRecord {
  email: string; // primary key, normalized to lowercase
  fullName: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string; // ISO timestamp
}

// Safe projection handed back to the UI — no credentials.
export interface User {
  email: string;
  fullName: string;
  createdAt: string;
}

export class EmailTakenError extends Error {
  constructor() {
    super('An account with this email already exists');
    this.name = 'EmailTakenError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email or password is incorrect');
    this.name = 'InvalidCredentialsError';
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toPublic = (record: UserRecord): User => ({
  email: record.email,
  fullName: record.fullName,
  createdAt: record.createdAt,
});

export async function findUser(email: string): Promise<User | undefined> {
  const record = await getRecord<UserRecord>('users', normalizeEmail(email));
  return record ? toPublic(record) : undefined;
}

export async function listUsers(): Promise<User[]> {
  const records = await getAllRecords<UserRecord>('users');
  return records.map(toPublic);
}

export interface RegisterInput {
  email: string;
  fullName: string;
  password: string;
}

// Create an account. Throws EmailTakenError if the email is already in use.
export async function registerUser({ email, fullName, password }: RegisterInput): Promise<User> {
  const key = normalizeEmail(email);
  const existing = await getRecord<UserRecord>('users', key);
  if (existing) throw new EmailTakenError();

  const { salt, hash } = await hashPassword(password);
  const record: UserRecord = {
    email: key,
    fullName: fullName.trim(),
    passwordSalt: salt,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  };
  await putRecord('users', record);
  return toPublic(record);
}

// Verify credentials. Throws InvalidCredentialsError on any mismatch.
export async function authenticateUser(email: string, password: string): Promise<User> {
  const record = await getRecord<UserRecord>('users', normalizeEmail(email));
  if (!record) throw new InvalidCredentialsError();

  const stored: PasswordHash = { salt: record.passwordSalt, hash: record.passwordHash };
  const ok = await verifyPassword(password, stored);
  if (!ok) throw new InvalidCredentialsError();

  return toPublic(record);
}
