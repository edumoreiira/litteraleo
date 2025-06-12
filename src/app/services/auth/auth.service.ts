import { computed, inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";
import { CurrentUser } from "app/models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;
  private currentUser = signal<CurrentUser | undefined>(undefined);
  $currentUser = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());

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

  async load() {
    const data = (await this.supabase.auth.getSession()).data;
    if (!data.session) return;
    const user = data.session.user;
    this.currentUser.set(user as unknown as CurrentUser);
    this.handleAuthStateChange();
  }

  handleAuthStateChange() {
  this.supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      const user = session?.user;
      this.currentUser.set(user! as unknown as CurrentUser);
    } else if (event === 'SIGNED_OUT') {
      this.currentUser.set(undefined);
    }
})
  }

  async logout() {
    return await this.supabase.auth.signOut();
  }
}