import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ChangePWProps, updateProfileSchemaProps } from '@/lib/schema/profile-schema';
import useAuthStore from '@/store/auth-store';

export function useChangePWMutation() {
  const apiFn = (data: ChangePWProps): Promise<string> => {
    return api.post(API_ENDPOINT.CHANGE_PASSWORD, data);
  };

  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Change password successfully');
    }
  });
}

interface IUpdateProfileRes {
  userInfo: UserResponseProps & { userId: number };
  permissions: Permission[];
}

export function useUpdateProfileMutation() {
  const { setUser, user } = useAuthStore((state) => state);

  const apiFn = (payload: updateProfileSchemaProps): Promise<IUpdateProfileRes> => {
    const formData = new FormData();

    if (payload.profileFile) {
      formData.append(
        'profileFile',
        payload.profileFile.file ? payload.profileFile.file : payload.profileFile?.url || ''
      );
    }
    // formData.append('firstName', payload.firstName);
    // formData.append('lastName', payload.lastName);
    // formData.append('email', payload.email);

    return api.post(API_ENDPOINT.UPDATE_PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  return useMutation({
    mutationFn: apiFn,
    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, profileUrl: data.userInfo.profileUrl }, data.permissions);
      }
      toast.success('Update profile successfully');
    }
  });
}
