type UserResponseProps = {
  profileUrl: string;
  referralCode?: string | null;
  id: number;
  username: string;
  password: string | null;
  firstName: string;
  lastName: string;
  balance: number;
  language: string;
  email: string;
  status: string;
  type: string;
  referrerCode?: string | null;
  gender: string;
  dob: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  count: number;
  fcmToken: string;
  deviceId: string;
};

type LoginResponseProps = {
  token: string;
  userInfo: UserResponseProps;
};

interface LoginRequest {
  username: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
  email?: string;
  gender?: string;
  dob?: string;
  abaProfile?: GetProfile;
}
