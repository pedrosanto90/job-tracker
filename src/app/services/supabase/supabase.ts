import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private readonly supabase: SupabaseClient;
  private readonly environment = environment;

  constructor() {
    this.supabase = createClient(
      this.environment.supabaseUrl,
      this.environment.supabaseKey
    );
  }

  get client() {
    return this.supabase;
  }
}
