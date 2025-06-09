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
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
  }
}