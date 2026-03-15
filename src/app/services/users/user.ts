import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  async getUser(user_id: string | null) {
    const { data, error } = await this.supabase.client
    .from('public.user_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

    if (error) {
      console.log(`error: ${error}`);
      return;
      }

    return data;
  }
}
