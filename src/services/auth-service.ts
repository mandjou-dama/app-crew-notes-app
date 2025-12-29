import { supabase } from './supabase';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export const authService = {
  signIn: (credentials: SignInWithPasswordCredentials) => {
    return supabase.auth.signInWithPassword(credentials);
  },
  signUp: (credentials: SignUpWithPasswordCredentials) => {
    return supabase.auth.signUp(credentials);
  },
  signOut: () => {
    return supabase.auth.signOut();
  },
};
