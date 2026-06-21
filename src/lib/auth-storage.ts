import {
  AUTH_SESSION_KEY,
  AUTH_USERS_KEY,
  type LoginInput,
  type Session,
  type SignupInput,
  type User,
} from "@/types/auth";

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(AUTH_USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function createId() {
  return crypto.randomUUID();
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null) {
  if (!isBrowser()) return;
  if (!session) {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getUserById(userId: string): User | null {
  return readUsers().find((user) => user.id === userId) ?? null;
}

export function getUserByEmail(email: string): User | null {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export function signup(input: SignupInput): { user: User } | { error: string } {
  const email = input.email.trim().toLowerCase();
  if (getUserByEmail(email)) {
    return { error: "An account with this email already exists." };
  }

  const user: User = {
    id: createId(),
    email,
    phone: input.phone.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...readUsers(), user]);
  setSession({ userId: user.id, email: user.email });

  return { user };
}

export function login(input: LoginInput): { user: User } | { error: string } {
  const user = getUserByEmail(input.email);
  if (!user || user.password !== input.password) {
    return { error: "Email or password is incorrect." };
  }

  setSession({ userId: user.id, email: user.email });
  return { user };
}

export function logout() {
  setSession(null);
}

export function registerFromQuiz(input: SignupInput): { user: User; created: boolean } {
  const existing = getUserByEmail(input.email);
  if (existing) {
    setSession({ userId: existing.id, email: existing.email });
    return { user: existing, created: false };
  }

  const result = signup(input);
  if ("error" in result) {
    throw new Error(result.error);
  }
  return { user: result.user, created: true };
}
