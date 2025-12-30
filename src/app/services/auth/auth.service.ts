import { computed, inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "../supabase/supabase.service";
import { CurrentUser, CustomJwtPayload, JwtUserRoles } from "app/models/user.interface";
import { jwtDecode } from 'jwt-decode'
import { Session } from "@supabase/supabase-js";
import { UserProfileService } from "../api/user-profile/user-profile.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;
  private supabaseUrl = inject(SupabaseService).url;
  private userProfileService = inject(UserProfileService);
  // 
  private currentUser = signal<CurrentUser | undefined>(undefined);
  private role = signal<JwtUserRoles>('anon');
  $userId = computed(() => this.currentUser()?.id);
  $currentUser = this.currentUser.asReadonly();
  $role = this.role.asReadonly();
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
    this.refreshRole(data.session ?? undefined);
    if (!data.session) return;
    const user = data.session.user;
    this.currentUser.set(user as unknown as CurrentUser);
    this.userProfileService.refreshCurrentUserProfile();
    this.handleAuthStateChange();
  }

  private handleAuthStateChange() {
  this.supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      const user = session?.user;
      this.currentUser.set(user! as unknown as CurrentUser);
      this.refreshRole(session!);
      this.userProfileService.refreshCurrentUserProfile();
    } else if (event === 'SIGNED_OUT') {
      this.currentUser.set(undefined);
      this.refreshRole(undefined);
      this.userProfileService.clearUserProfile();
    }
})
  }

  async logout() {
    try {
      await this.supabase.auth.signOut();
    } catch (err) {
      console.error("Erro ao invalidar sessão no servidor:", err);
    } finally {
      // Força remoção local da sessão
      const url = this.supabaseUrl;
      const projectRef = url.replace("https://", "").split(".")[0];
      localStorage.removeItem(`sb-${projectRef}-auth-token`);
      this.currentUser.set(undefined);
    }
  }

  private refreshRole(session?: Session) {
    const role = session ? jwtDecode<CustomJwtPayload>(session.access_token).user_role ?? 'anon' : 'anon';
    this.role.set(role);
  }
  
}