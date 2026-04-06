import { Injectable, computed, signal } from '@angular/core';

export interface User {
  id?: string;
  email: string;
  name: string;
}

interface RegisteredUser {
  email: string;
  password: string;
  name: string;
}

const AUTH_USERS_STORAGE_KEY = 'food-ordering-auth-users';
const DEFAULT_USERS: RegisteredUser[] = [
  { email: 'demo@example.com', password: 'password123', name: 'Demo User' },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user = signal<User | null>(null);
  private readonly registeredUsers = signal<Map<string, RegisteredUser>>(
    this.loadRegisteredUsers(),
  );

  readonly currentUser = computed(() => this.user());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(email: string, password: string): { success: boolean; message?: string } {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = this.registeredUsers();
    const registeredUser = users.get(normalizedEmail);

    if (!registeredUser) {
      return { success: false, message: 'Account not found' };
    }

    if (registeredUser.password !== normalizedPassword) {
      return { success: false, message: 'Incorrect password' };
    }

    this.user.set({
      id: normalizedEmail,
      email: registeredUser.email,
      name: registeredUser.name,
    });
    return { success: true };
  }

  signup(email: string, password: string, name: string): { success: boolean; message?: string } {
    if (!email || !password || !name) {
      return { success: false, message: 'All fields are required' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const normalizedName = name.trim();

    if (!normalizedEmail || !normalizedPassword || !normalizedName) {
      return { success: false, message: 'All fields are required' };
    }

    const users = this.registeredUsers();

    if (users.has(normalizedEmail)) {
      return { success: false, message: 'Email already registered' };
    }

    const updatedUsers = new Map(users);
    updatedUsers.set(normalizedEmail, {
      email: normalizedEmail,
      password: normalizedPassword,
      name: normalizedName,
    });
    this.registeredUsers.set(updatedUsers);
    this.persistRegisteredUsers(updatedUsers);

    this.user.set({
      id: normalizedEmail,
      email: normalizedEmail,
      name: normalizedName,
    });
    return { success: true };
  }

  logout(): void {
    this.user.set(null);
  }

  private loadRegisteredUsers(): Map<string, RegisteredUser> {
    const fallback = new Map(DEFAULT_USERS.map((user) => [user.email, user]));

    try {
      const rawUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
      if (!rawUsers) {
        this.persistRegisteredUsers(fallback);
        return fallback;
      }

      const parsedUsers = JSON.parse(rawUsers) as RegisteredUser[];
      if (!Array.isArray(parsedUsers)) {
        return fallback;
      }

      const usersMap = new Map<string, RegisteredUser>();
      for (const user of parsedUsers) {
        if (!user?.email || !user?.password || !user?.name) {
          continue;
        }
        const key = user.email.trim().toLowerCase();
        usersMap.set(key, {
          email: key,
          password: user.password,
          name: user.name,
        });
      }

      if (usersMap.size === 0) {
        this.persistRegisteredUsers(fallback);
        return fallback;
      }

      return usersMap;
    } catch {
      return fallback;
    }
  }

  private persistRegisteredUsers(users: Map<string, RegisteredUser>): void {
    try {
      localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(Array.from(users.values())));
    } catch {
      // Ignore storage errors; auth still works for the current session.
    }
  }
}
