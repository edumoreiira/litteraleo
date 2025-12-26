import { inject, Injectable, signal } from '@angular/core';
import { UserProfile } from 'app/models/user.interface';
import { SupabaseService } from 'app/services/supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private supabase = inject(SupabaseService).client;
  private userProfile = signal<UserProfile | null>(null);
  userProfile$ = this.userProfile.asReadonly();

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }

  async refreshCurrentUserProfile() {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return;
    const { data, error } = await this.getUserProfile(userId);
    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }
    this.userProfile.set(data);
    console.log(this.userProfile$());
  }

  clearUserProfile() {
    this.userProfile.set(null);
  }
}