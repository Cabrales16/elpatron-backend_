import { apiClient } from "./api";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "../../firebase";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "OPERATOR";
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

class AuthService {
  private user: User | null = null;

  constructor() {
    this.loadUserFromStorage();
    this.listenToAuthChanges();
  }

  private loadUserFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
  }

  private saveUserToStorage(user: User) {
    this.user = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  private clearUserFromStorage() {
    this.user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
    }
  }

  private async syncToken() {
    if (!firebaseAuth.currentUser) return;
    const token = await firebaseAuth.currentUser.getIdToken();
    apiClient.setToken(token);
  }

  private listenToAuthChanges() {
    onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (!fbUser) {
        this.clearUserFromStorage();
        return;
      }

      const role = fbUser.email === "admin@elpatron.com" ? "ADMIN" : "OPERATOR";
      const user: User = {
        id: Date.now(),
        email: fbUser.email || "",
        name: fbUser.displayName || (fbUser.email?.split("@")[0] ?? "Usuario"),
        role,
      };

      this.saveUserToStorage(user);
      await this.syncToken();
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const result = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    const role =
      result.user.email === "admin@elpatron.com" ? "ADMIN" : "OPERATOR";
    const user: User = {
      id: Date.now(),
      email: result.user.email || email,
      name: result.user.displayName || email.split("@")[0],
      role,
    };
    this.saveUserToStorage(user);
    await this.syncToken();
    return { access_token: apiClient.getToken() || "", user };
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    const result = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );
    const user: User = {
      id: Date.now(),
      email: result.user.email || email,
      name: name || email.split("@")[0],
      role: "OPERATOR",
    };
    this.saveUserToStorage(user);
    await this.syncToken();
    return { access_token: apiClient.getToken() || "", user };
  }

  async fetchCurrentUser(): Promise<User> {
    if (!firebaseAuth.currentUser) {
      throw new Error("No hay usuario autenticado");
    }
    const role =
      firebaseAuth.currentUser.email === "admin@elpatron.com"
        ? "ADMIN"
        : "OPERATOR";
    const user: User = {
      id: Date.now(),
      email: firebaseAuth.currentUser.email || "",
      name:
        firebaseAuth.currentUser.displayName ||
        (firebaseAuth.currentUser.email?.split("@")[0] ?? "Usuario"),
      role,
    };
    this.saveUserToStorage(user);
    await this.syncToken();
    return user;
  }

  logout() {
    this.user = null;
    apiClient.clearToken();
    signOut(firebaseAuth).catch(() => undefined);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("auth_token");
    return !!token && !!this.user;
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }
}

export const authService = new AuthService();
