export interface CustomUser {
    id: string;
    email: string;
    referral_id: string;
  }
  
  export interface AuthState {
    user: CustomUser | null;
    loading: boolean;
  }