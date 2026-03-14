export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string | null;
  createdAt: Date;
  isActive: boolean;
}