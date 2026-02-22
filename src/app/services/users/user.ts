import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly supabase: Supabase;

  constructor(supabase: Supabase){
    this.supabase = supabase;
  }

  async addUser(user_id: string, username: string) {
    const { data, error } = await this.supabase.client
    .from('public.user_profiles')
    .insert({user_id: user_id, username: username})

    if (error) {
      console.log(`error: ${error}`);
      return;
      }

    return data;
  }
}
