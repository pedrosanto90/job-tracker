import { Injectable } from '@angular/core';
import type { AuthResponse } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';
import { NewUser } from '../../interfaces/user/new-user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly supabase: Supabase;

  constructor(supabase: Supabase) {
    this.supabase = supabase;
  }

  async signUp(user: NewUser): Promise<AuthResponse> {
    const response = await this.supabase.client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: { username: user.username },
      },
    });

    if (response.error) {
      console.error(`Auth signUp error: ${response.error}`);
    }

    return response;
  }
}
