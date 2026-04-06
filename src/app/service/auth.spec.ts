import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.removeItem('food-ordering-auth-users');
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  describe('Initial State', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should start with no authenticated user', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('should have isAuthenticated as false initially', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should have demo account pre-registered', () => {
      const result = service.login('demo@example.com', 'password123');
      expect(result.success).toBe(true);
    });
  });

  describe('Login', () => {
    it('should successfully login with valid credentials', () => {
      const result = service.login('demo@example.com', 'password123');
      expect(result.success).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should set current user after successful login', () => {
      service.login('demo@example.com', 'password123');
      const user = service.currentUser();
      expect(user).toBeTruthy();
      expect(user?.email).toBe('demo@example.com');
      expect(user?.name).toBe('Demo User');
    });

    it('should update isAuthenticated to true after login', () => {
      service.login('demo@example.com', 'password123');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should reject login with non-existent email', () => {
      const result = service.login('nonexistent@example.com', 'password123');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Account not found');
    });

    it('should reject login with incorrect password', () => {
      const result = service.login('demo@example.com', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Incorrect password');
    });

    it('should not authenticate user with wrong password', () => {
      service.login('demo@example.com', 'wrongpassword');
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should reject empty email', () => {
      const result = service.login('', 'password123');
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = service.login('demo@example.com', '');
      expect(result.success).toBe(false);
    });
  });

  describe('Signup', () => {
    it('should successfully create new account', () => {
      const result = service.signup('newuser@example.com', 'password123', 'New User');
      expect(result.success).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should log in user after successful signup', () => {
      service.signup('newuser@example.com', 'password123', 'New User');
      expect(service.isAuthenticated()).toBe(true);
      const user = service.currentUser();
      expect(user?.email).toBe('newuser@example.com');
      expect(user?.name).toBe('New User');
    });

    it('should prevent duplicate email registration', () => {
      service.signup('duplicate@example.com', 'password123', 'User One');
      const result = service.signup('duplicate@example.com', 'password456', 'User Two');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already registered');
    });

    it('should prevent duplicate demo account email', () => {
      const result = service.signup('demo@example.com', 'password456', 'Another User');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email already registered');
    });

    it('should allow login with newly created account', () => {
      service.logout();
      service.signup('testuser@example.com', 'testpass123', 'Test User');
      service.logout();

      const result = service.login('testuser@example.com', 'testpass123');
      expect(result.success).toBe(true);
      expect(service.currentUser()?.email).toBe('testuser@example.com');
    });
  });

  describe('Logout', () => {
    it('should clear current user', () => {
      service.login('demo@example.com', 'password123');
      expect(service.currentUser()).toBeTruthy();

      service.logout();
      expect(service.currentUser()).toBeNull();
    });

    it('should set isAuthenticated to false', () => {
      service.login('demo@example.com', 'password123');
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should allow re-login after logout', () => {
      service.login('demo@example.com', 'password123');
      service.logout();
      const result = service.login('demo@example.com', 'password123');
      expect(result.success).toBe(true);
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('Computed Signals', () => {
    it('currentUser should update reactively', () => {
      expect(service.currentUser()).toBeNull();
      service.login('demo@example.com', 'password123');
      expect(service.currentUser()).toBeTruthy();
    });

    it('isAuthenticated should update reactively', () => {
      expect(service.isAuthenticated()).toBe(false);
      service.login('demo@example.com', 'password123');
      expect(service.isAuthenticated()).toBe(true);
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Data Persistence Within Session', () => {
    it('should maintain multiple user accounts', () => {
      service.signup('user1@example.com', 'pass1', 'User One');
      service.logout();
      service.signup('user2@example.com', 'pass2', 'User Two');
      service.logout();

      const loginResult1 = service.login('user1@example.com', 'pass1');
      expect(loginResult1.success).toBe(true);
    });

    it('should handle rapid login/logout cycles', () => {
      for (let i = 0; i < 5; i++) {
        service.login('demo@example.com', 'password123');
        expect(service.isAuthenticated()).toBe(true);
        service.logout();
        expect(service.isAuthenticated()).toBe(false);
      }
    });
  });
});
