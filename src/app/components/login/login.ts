import { Component, inject } from '@angular/core';
import { Button } from "../button/button";
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/supabase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, Button, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginError = false;
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  // need to check this form builder
  protected readonly form = this.fb.group({
    email: this.fb.control(''),
    password: this.fb.control(''),
  });


  onSubmitLogin() {
    const { email, password } = this.form.getRawValue();
    // call auth service to log in the user
    console.log('Login ok', { email, password });
    this.authService.signin({ email, password }).then(user => {
      if (user) {
        console.log('User logged in:', user);
        this.loginError = false;
        this.router.navigate(['/dashboard', user.id]);
      } else {
        console.error('Login failed');
        this.loginError = true;
      }
    }).catch(error => {
      console.error('Error during login:', error);
      this.loginError = true;
    });
  }
}
