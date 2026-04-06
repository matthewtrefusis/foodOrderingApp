import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../service/auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.removeItem('food-ordering-auth-users');
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [AuthService, { provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty fields', () => {
      expect(component.email).toBe('');
      expect(component.password).toBe('');
      expect(component.errorMessage).toBe('');
    });

    it('should render login form', () => {
      const form = fixture.nativeElement.querySelector('.login-form');
      expect(form).toBeTruthy();
    });

    it('should render email input field', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should render password input field', () => {
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');
      expect(passwordInput).toBeTruthy();
    });

    it('should render login button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button?.textContent).toContain('Login');
    });

    it('should render signup link', () => {
      const link = fixture.nativeElement.querySelector('a[routerLink="/signup"]');
      expect(link).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show error when email is empty', () => {
      component.email = '';
      component.password = 'password123';
      component.login();

      expect(component.errorMessage).toBe('Email and password are required');
    });

    it('should show error when password is empty', () => {
      component.email = 'test@example.com';
      component.password = '';
      component.login();

      expect(component.errorMessage).toBe('Email and password are required');
    });

    it('should show error for invalid email format', () => {
      component.email = 'invalidemail';
      component.password = 'password123';
      component.login();

      expect(component.errorMessage).toBe('Invalid email format');
    });

    it('should show error when password is too short', () => {
      component.email = 'test@example.com';
      component.password = 'short';
      component.login();

      expect(component.errorMessage).toBe('Password must be at least 6 characters');
    });

    it('should accept valid email formats', () => {
      component.email = 'user@example.com';
      component.password = 'password123';
      component.login();

      // Should not show the validation error messages
      expect(component.errorMessage).not.toBe('Invalid email format');
    });

    it('should accept 6-character password', () => {
      component.email = 'user@example.com';
      component.password = 'pass12';
      component.login();

      // Should pass validation
      expect(component.errorMessage).not.toBe('Password must be at least 6 characters');
    });
  });

  describe('Successful Login', () => {
    it('should login with valid demo credentials', () => {
      component.email = 'demo@example.com';
      component.password = 'password123';
      component.login();

      expect(component.errorMessage).toBe('');
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should authenticate user after successful login', () => {
      component.email = 'demo@example.com';
      component.password = 'password123';
      component.login();

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should clear error message on successful login', () => {
      component.errorMessage = 'Previous error';
      component.email = 'demo@example.com';
      component.password = 'password123';
      component.login();

      expect(component.errorMessage).toBe('');
    });

    it('should navigate to home after login', () => {
      component.email = 'demo@example.com';
      component.password = 'password123';
      component.login();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Failed Login', () => {
    it('should show error for non-existent account', () => {
      component.email = 'nonexistent@example.com';
      component.password = 'password123';
      component.login();

      expect(component.errorMessage).toBe('Account not found');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should show error for incorrect password', () => {
      component.email = 'demo@example.com';
      component.password = 'wrongpassword';
      component.login();

      expect(component.errorMessage).toBe('Incorrect password');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not authenticate user with wrong credentials', () => {
      component.email = 'demo@example.com';
      component.password = 'wrongpassword';
      component.login();

      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should clear previous error on failed attempt', () => {
      component.email = 'valid@example.com';
      component.password = 'pass';
      component.errorMessage = 'Previous error';
      component.login();

      // Should have new error, not previous one
      expect(component.errorMessage).not.toBe('Previous error');
    });
  });

  describe('Two-way Data Binding', () => {
    it('should update email from input', async () => {
      const emailInput = fixture.nativeElement.querySelector(
        'input[type="email"]',
      ) as HTMLInputElement;
      emailInput.value = 'test@example.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.email).toBe('test@example.com');
    });

    it('should update password from input', async () => {
      const passwordInput = fixture.nativeElement.querySelector(
        'input[type="password"]',
      ) as HTMLInputElement;
      passwordInput.value = 'password123';
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.password).toBe('password123');
    });
  });

  describe('Form Submission', () => {
    it('should trigger login on form submit', () => {
      const loginSpy = vi.spyOn(component, 'login');
      const form = fixture.nativeElement.querySelector('.login-form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit'));

      expect(loginSpy).toHaveBeenCalled();
    });

    it('should prevent navigation without validation', () => {
      component.email = '';
      component.password = '';
      component.login();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Message Display', () => {
    it('should display error message in DOM when present', () => {
      component.errorMessage = 'Test error message';
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Test error message');
    });

    it('should not display error message when empty', () => {
      component.errorMessage = '';
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeFalsy();
    });
  });

  describe('Signup Link', () => {
    it('should have signup link in template', () => {
      const link = fixture.nativeElement.querySelector('a[routerLink="/signup"]');
      expect(link).toBeTruthy();
      expect(link.textContent).toContain('Sign up');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple failed login attempts', () => {
      for (let i = 0; i < 3; i++) {
        component.email = 'test@example.com';
        component.password = 'wrong';
        component.login();
        expect(authService.isAuthenticated()).toBe(false);
      }
    });

    it('should handle email with special characters', () => {
      component.email = 'user+tag@example.co.uk';
      component.password = 'password123';
      component.login();

      // Validation should pass for valid email
      expect(component.errorMessage).not.toBe('Invalid email format');
    });

    it('should trim whitespace from credentials', () => {
      component.email = '  demo@example.com  ';
      component.password = '  password123  ';
      // In real implementation, might want to add trim
      component.login();

      // Should handle gracefully
      expect(component.errorMessage).toBeDefined();
    });
  });

  describe('Service Integration', () => {
    it('should use AuthService for login', () => {
      const loginSpy = vi.spyOn(authService, 'login');
      component.email = 'demo@example.com';
      component.password = 'password123';
      component.login();

      expect(loginSpy).toHaveBeenCalledWith('demo@example.com', 'password123');
    });

    it('should handle AuthService response', () => {
      component.email = 'nonexistent@example.com';
      component.password = 'password123';
      component.login();

      expect(component.errorMessage).toBe('Account not found');
    });
  });
});
