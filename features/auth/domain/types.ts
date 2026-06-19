export interface AuthUser {
  id: string;
  provider: string;
  email: string | null;
  nickname: string | null;
  createdAt: string;
}
