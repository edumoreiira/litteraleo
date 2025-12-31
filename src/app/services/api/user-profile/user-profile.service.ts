import { inject, Injectable, signal } from '@angular/core';
import { UpdateUserProfileDTO, UserProfile } from 'app/models/user.interface';
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
    const userId = (await this.supabase.auth.getSession()).data.session?.user.id
    if (!userId) return;
    const { data, error } = await this.getUserProfile(userId);
    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }
    this.userProfile.set(data);
  }

  clearUserProfile() {
    this.userProfile.set(null);
  }

  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // 1. Gerar caminho seguro: user_id / timestamp_nome-do-arquivo
    // Ex: "a1b2-c3d4/173555555_meu-avatar.png"
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // 2. Fazer o Upload para o bucket 'avatars'
    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true // Sobrescreve se existir arquivo com MESMO nome exato
      });

    if (uploadError) throw uploadError;

    // 3. Pegar a URL Pública
    const { data: { publicUrl } } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async updateUserProfile(userData: UpdateUserProfileDTO, avatarFile?: File) {
    let avatar_url: string | undefined = undefined;

    if (avatarFile) {
      avatar_url = await this.uploadAvatar(avatarFile);
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .update({
        full_name: userData.full_name,
        avatar_url: avatar_url,
      })
      .eq('id', userData.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    this.userProfile.set(data as UserProfile); // update user profile signal
    return data as UserProfile;
  }
}