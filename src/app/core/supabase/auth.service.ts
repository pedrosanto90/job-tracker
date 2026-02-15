import { Injectable, signal } from "@angular/core";
import { supabase } from "./supabase.client";
import { User } from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async signup(user: { email: string, password: string }) {
    const newUser = await supabase.auth.signUp({
      email: user.email,
      password: user.password
    })
    if (!newUser) {return;}
    return newUser;
  }
}
