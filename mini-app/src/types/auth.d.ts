type UserResponseProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileUrl?: string | null;
  status: string;
  role: string;
  language?: string;
  gender?: string | null;
  dob?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponseProps = {
  token: string;
  user: UserResponseProps;
};

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
