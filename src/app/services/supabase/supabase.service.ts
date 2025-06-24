// supabase.service.ts
import { Injectable } from "@angular/core";
import { environment } from "@env/environment.development";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  
  get client(): SupabaseClient {
    return this.supabase;
  }

  constructor() {
    this.supabase = createClient(
      environment.SUPABASE_URL, 
      environment.SUPABASE_KEY,
      {
        global: {
          fetch: (url, options) => {
            // Corrige problemas de URL no Firefox
            const cleanedUrl = new URL(url.toString());
            return fetch(cleanedUrl.toString(), options);
          }
        }
      }
    );
  }
}