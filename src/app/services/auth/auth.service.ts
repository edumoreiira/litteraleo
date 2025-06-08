import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).supabase;

  async signInWithEmail(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password })
    .then(response => console.log(response));
  }
}