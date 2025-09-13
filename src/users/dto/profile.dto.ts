export class ProfileDto {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  phone?: string;
  profile_picture: string;
  verification_status: string;
  seller_badge: boolean;
  avg_rating: number;
  rating_count: number;
  createdAt: Date;
  updatedAt: Date;
}
