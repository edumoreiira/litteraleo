import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;

  async signInWithEmail(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUpWithEmail(name: string, email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password, options: { data: { full_name: name }} });
  }
  
  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async signInWithGoogle() {
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  }
}