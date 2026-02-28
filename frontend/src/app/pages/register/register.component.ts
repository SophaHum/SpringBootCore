import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

  registerForm!: FormGroup;
  loading = signal(false);
  submitted = signal(false);
  error = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  success = signal(false);

  passwordStrength = signal(0);
  passwordStrengthLabel = computed(() => {
    const s = this.passwordStrength();
    if (s === 0) return '';
    if (s <= 1) return 'Weak';
    if (s <= 2) return 'Fair';
    if (s <= 3) return 'Good';
    return 'Strong';
  });
  passwordStrengthColor = computed(() => {
    const s = this.passwordStrength();
    if (s <= 1) return 'var(--color-danger)';
    if (s <= 2) return 'var(--color-warning)';
    if (s <= 3) return 'var(--color-info)';
    return 'var(--color-success)';
  });

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    // Watch password changes for strength
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      this.calculatePasswordStrength(val);
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  calculatePasswordStrength(password: string): void {
    let strength = 0;
    if (!password) {
      this.passwordStrength.set(0);
      return;
    }
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    this.passwordStrength.set(strength);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.error.set('');

    if (this.registerForm.invalid) {
      return;
    }

    this.loading.set(true);
    const { name, email, password, confirmPassword } = this.registerForm.value;

    this.authService.register({ name, email, password, confirmPassword })
      .subscribe({
        next: (response) => {
          if (response.success || response.token) {
            this.success.set(true);
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
          } else {
            this.error.set(response.message || 'Registration failed');
            this.loading.set(false);
          }
        },
        error: (err) => {
          this.error.set(err.error?.message || 'An error occurred during registration');
          this.loading.set(false);
        }
      });
  }
}
