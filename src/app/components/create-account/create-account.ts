import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthResponse } from '@supabase/supabase-js';
import { Button } from '../button/button';
import { Auth } from '../../services/auth/auth';
import { NewUser } from '../../interfaces/user/new-user';

@Component({
  selector: 'app-create-account',
  imports: [CommonModule, ReactiveFormsModule, Button],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
})
export class CreateAccount {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(Auth);

  protected readonly form = this.fb.group(
    {
      username: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/),
        ],
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required],
      }),
    },
    { validators: [passwordsMatch], updateOn: 'blur' }
  );

  async onSubmitCreateAccount() {
    if (this.form.invalid) {
      return;
    }

    const { username, email, password } = this.form.getRawValue();
    const user: NewUser = {
      email,
      username,
      password,
    };

    const { data, error }: AuthResponse = await this.authService.signUp(user);

    if (error) {
      console.error(`Auth signUp error: ${error}`);
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      console.error('Auth signUp returned without user id');
      return;
    }
  }
}

// should put this into a helper
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
}
