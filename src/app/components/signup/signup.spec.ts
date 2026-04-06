import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SignupComponent } from './signup';
import { AuthService } from '../../service/auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.removeItem('food-ordering-auth-users');
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [AuthService, { provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
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
      expect(component.name).toBe('');
      expect(component.email).toBe('');
      expect(component.password).toBe('');
      expect(component.confirmPassword).toBe('');
      expect(component.errorMessage).toBe('');
    });

    it('should render signup form', () => {
      const form = fixture.nativeElement.querySelector('.signup-form');
      expect(form).toBeTruthy();
    });

    it('should render name input field', () => {
      const nameInput = fixture.nativeElement.querySelector('input[type="text"][id="name"]');
      expect(nameInput).toBeTruthy();
    });

    it('should render email input field', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      expect(emailInput).toBeTruthy();
    });

    it('should render password input fields', () => {
      const passwordInputs = fixture.nativeElement.querySelectorAll('input[type="password"]');
      expect(passwordInputs.length).toBe(2);
    });

    it('should render signup button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button?.textContent).toContain('Sign Up');
    });

    it('should render login link', () => {
      const link = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(link).toBeTruthy();
    });
  });

  describe('Form Validation - Required Fields', () => {
    it('should show error when name is empty', () => {
      component.name = '';
      component.email = 'test@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('All fields are required');
    });

    it('should show error when email is empty', () => {
      component.name = 'Test User';
      component.email = '';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('All fields are required');
    });

    it('should show error when password is empty', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = '';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('All fields are required');
    });

    it('should show error when confirmPassword is empty', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'password123';
      component.confirmPassword = '';
      component.signup();

      expect(component.errorMessage).toBe('All fields are required');
    });
  });

  describe('Form Validation - Email Format', () => {
    it('should show error for invalid email format', () => {
      component.name = 'Test User';
      component.email = 'invalidemail';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('Invalid email format');
    });

    it('should show error for email without domain', () => {
      component.name = 'Test User';
      component.email = 'user@localhost';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('Invalid email format');
    });

    it('should accept valid email format', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).not.toBe('Invalid email format');
    });

    it('should accept email with subdomain', () => {
      component.name = 'Test User';
      component.email = 'user@mail.example.co.uk';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).not.toBe('Invalid email format');
    });
  });

  describe('Form Validation - Password', () => {
    it('should show error when password is too short', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'short';
      component.confirmPassword = 'short';
      component.signup();

      expect(component.errorMessage).toBe('Password must be at least 6 characters');
    });

    it('should accept 6-character password', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'pass12';
      component.confirmPassword = 'pass12';
      component.signup();

      expect(component.errorMessage).not.toBe('Password must be at least 6 characters');
    });

    it('should show error when passwords do not match', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password456';
      component.signup();

      expect(component.errorMessage).toBe('Passwords do not match');
    });

    it('should accept matching passwords', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).not.toBe('Passwords do not match');
    });
  });

  describe('Successful Signup', () => {
    it('should signup with valid credentials', () => {
      component.name = 'New User';
      component.email = 'newuser@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('');
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should authenticate user after successful signup', () => {
      component.name = 'New User';
      component.email = 'newuser@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should set correct user data after signup', () => {
      component.name = 'John Doe';
      component.email = 'john@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      const user = authService.currentUser();
      expect(user?.name).toBe('John Doe');
      expect(user?.email).toBe('john@example.com');
    });

    it('should navigate to home after signup', () => {
      component.name = 'New User';
      component.email = 'newuser@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Failed Signup', () => {
    it('should show error for duplicate email', () => {
      authService.signup('existing@example.com', 'password123', 'Existing User');
      component.name = 'Other User';
      component.email = 'existing@example.com';
      component.password = 'password456';
      component.confirmPassword = 'password456';
      component.signup();

      expect(component.errorMessage).toBe('Email already registered');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not authenticate user with duplicate email', () => {
      authService.logout();
      authService.signup('dup@example.com', 'pass1', 'User 1');
      authService.logout();

      component.name = 'User 2';
      component.email = 'dup@example.com';
      component.password = 'pass2';
      component.confirmPassword = 'pass2';
      component.signup();

      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should not allow demo@example.com registration', () => {
      component.name = 'Another User';
      component.email = 'demo@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('Email already registered');
    });
  });

  describe('Two-way Data Binding', () => {
    it('should update name from input', async () => {
      const nameInput = fixture.nativeElement.querySelector(
        'input[type="text"][id="name"]',
      ) as HTMLInputElement;
      nameInput.value = 'John Doe';
      nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.name).toBe('John Doe');
    });

    it('should update email from input', async () => {
      const emailInput = fixture.nativeElement.querySelector(
        'input[type="email"]',
      ) as HTMLInputElement;
      emailInput.value = 'john@example.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.email).toBe('john@example.com');
    });

    it('should update password from input', async () => {
      const passwordInputs = fixture.nativeElement.querySelectorAll('input[type="password"]');
      const passwordInput = passwordInputs[0] as HTMLInputElement;
      passwordInput.value = 'password123';
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.password).toBe('password123');
    });

    it('should update confirmPassword from input', async () => {
      const passwordInputs = fixture.nativeElement.querySelectorAll('input[type="password"]');
      const confirmInput = passwordInputs[1] as HTMLInputElement;
      confirmInput.value = 'password123';
      confirmInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.confirmPassword).toBe('password123');
    });
  });

  describe('Form Submission', () => {
    it('should trigger signup on form submit', () => {
      const signupSpy = vi.spyOn(component, 'signup');
      const form = fixture.nativeElement.querySelector('.signup-form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit'));

      expect(signupSpy).toHaveBeenCalled();
    });

    it('should prevent navigation without validation', () => {
      component.name = '';
      component.email = '';
      component.password = '';
      component.confirmPassword = '';
      component.signup();

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

  describe('Login Link', () => {
    it('should have login link in template', () => {
      const link = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(link).toBeTruthy();
      expect(link.textContent).toContain('Login');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple signup attempts with same email', () => {
      component.name = 'User One';
      component.email = 'same@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      component.name = 'User Two';
      component.email = 'same@example.com';
      component.password = 'password456';
      component.confirmPassword = 'password456';
      component.signup();

      expect(component.errorMessage).toBe('Email already registered');
    });

    it('should handle case-sensitive email', () => {
      authService.logout();
      component.name = 'User';
      component.email = 'Test@Example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).toBe('');
    });

    it('should accept long user names', () => {
      component.name = 'A'.repeat(100);
      component.email = 'user@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(component.errorMessage).not.toBe('All fields are required');
    });

    it('should accept strong passwords', () => {
      component.name = 'Test User';
      component.email = 'test@example.com';
      component.password = 'MyP@ssw0rd!#$%';
      component.confirmPassword = 'MyP@ssw0rd!#$%';
      component.signup();

      expect(component.errorMessage).not.toBe('Password must be at least 6 characters');
    });
  });

  describe('Service Integration', () => {
    it('should use AuthService for signup', () => {
      const signupSpy = vi.spyOn(authService, 'signup');
      component.name = 'New User';
      component.email = 'newuser@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password123';
      component.signup();

      expect(signupSpy).toHaveBeenCalledWith('newuser@example.com', 'password123', 'New User');
    });

    it('should handle AuthService response for duplicate', () => {
      authService.signup('dup2@example.com', 'pass', 'User');
      authService.logout();

      component.name = 'Other';
      component.email = 'dup2@example.com';
      component.password = 'pass123';
      component.confirmPassword = 'pass123';
      component.signup();

      expect(component.errorMessage).toBe('Email already registered');
    });
  });

  describe('Validation Order', () => {
    it('should check required fields before email format', () => {
      component.name = '';
      component.email = 'invalidemail';
      component.password = 'short';
      component.confirmPassword = 'nomatch';
      component.signup();

      expect(component.errorMessage).toBe('All fields are required');
    });

    it('should check email format before password', () => {
      component.name = 'Test';
      component.email = 'invalid';
      component.password = 'pass123';
      component.confirmPassword = 'pass123';
      component.signup();

      expect(component.errorMessage).toBe('Invalid email format');
    });

    it('should check password length before password match', () => {
      component.name = 'Test';
      component.email = 'test@example.com';
      component.password = 'short';
      component.confirmPassword = 'short';
      component.signup();

      expect(component.errorMessage).toBe('Password must be at least 6 characters');
    });

    it('should check password match last', () => {
      component.name = 'Test';
      component.email = 'test@example.com';
      component.password = 'password123';
      component.confirmPassword = 'password456';
      component.signup();

      expect(component.errorMessage).toBe('Passwords do not match');
    });
  });
});
