import useAuthStore from '@/store/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { useRef, useState } from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import FormInput from './form-input';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { changePWSchema, type ChangePWProps } from '@/lib/schema/profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useChangePWMutation,
  useUpdateProfileMutation
} from '@/hooks/mutations/use-profile-mutation';
import Cookies from 'js-cookie';
// import { RightSideDrawer } from './notification-drawer';

function ProfileDialogContent({
  user,
  handleLogout,
  handleChangePw
}: {
  user: UserResponseProps | null;
  handleLogout: () => void;
  handleChangePw: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  const { isPending, mutate } = useUpdateProfileMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      mutate({ profileFile: { url: '', file } });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <DialogContent className="w-full max-w-[500px] flex flex-col p-0">
      <DialogHeader className="border-b p-6">
        <DialogTitle className="sr-only">Profile</DialogTitle>
      </DialogHeader>
      <div className="flex pt-4 px-10">
        <div className="mr-16 flex flex-col items-center">
          <Avatar className="rounded-sm size-28">
            <AvatarImage src={previewImage || user?.profileUrl} alt="profile-picture" />
            <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            className="text-primary mt-1"
            variant="ghost"
            isLoading={isPending}
            onClick={triggerFileInput}
          >
            Edit Profile
          </Button>
        </div>

        <div className="border-b-2 flex-1">
          <p className="mb-2">Profile Information</p>
          <div className="py-3 flex">
            <div className="flex-1">
              <p className="text-gray-400 text-sm">First Name</p>
              <p>{user?.firstName || 'N/A'}</p>
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm">Last Name</p>
              <p>{user?.lastName || 'N/A'}</p>
            </div>
          </div>
          <div className="pt-3 pb-4 border-b-2">
            <p className="text-gray-400 text-sm">Email</p>
            <p>{user?.email || 'N/A'}</p>
          </div>

          <p className="mb-2 mt-4">Account Information</p>
          <div className="py-3">
            <p className="text-gray-400 text-sm">Username</p>
            <p>{user?.username || 'N/A'}</p>
          </div>
          <div className="py-3">
            <p className="text-gray-400 text-sm">Password</p>
            <p>**********</p>
            <Button
              className="p-0 h-auto text-primary mb-2"
              variant="link"
              onClick={handleChangePw}
            >
              Change password
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0 flex">
        <Button
          className="flex-1 text-red-500 hover:text-red-500"
          type="button"
          variant="ghost"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </DialogContent>
  );
}

function PasswordDialogContent({
  handleClose
}: {
  user: UserResponseProps | null;
  handleClose: () => void;
}) {
  const { isPending, mutateAsync } = useChangePWMutation();

  const changePwForm = useForm<ChangePWProps>({
    mode: 'onSubmit',
    resolver: zodResolver(changePWSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = async (values: ChangePWProps) => {
    // console.log('onSubmit: ', values);
    await mutateAsync(values);
    handleClose();
  };

  return (
    <DialogContent className="w-full max-w-[500px] flex flex-col p-0" showCloseButton={false}>
      <DialogHeader className="border-b px-4 py-1">
        <DialogTitle className="sr-only">Update password</DialogTitle>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <ChevronLeft className="!size-6" />
        </Button>
      </DialogHeader>
      <Form {...changePwForm}>
        <form onSubmit={changePwForm.handleSubmit(onSubmit)}>
          <div className="py-2 px-8">
            <div className="border-b-2 flex-1">
              <p>Update Password</p>
              <div className="my-3">
                <p className="text-gray-400 text-sm mb-1">Current Password</p>
                <FormInput
                  className="w-full"
                  control={changePwForm.control}
                  name="oldPassword"
                  placeholder="password"
                  type="password"
                />
              </div>
              <div className="my-3">
                <p className="text-gray-400 text-sm mb-1">New Password</p>
                <FormInput
                  className="w-full"
                  control={changePwForm.control}
                  name="newPassword"
                  placeholder="password"
                  type="password"
                />
              </div>
            </div>
          </div>
          <div className="p-4 pt-0 flex justify-end">
            <Button className="text-primary" type="submit" variant="ghost" isLoading={isPending}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

function LogoutDialogContent({ handleClose }: { handleClose: () => void }) {
  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };
  return (
    <DialogContent className="w-full max-w-[380px] flex flex-col p-0" showCloseButton={false}>
      <DialogHeader className="border-b px-4 py-1">
        <DialogTitle className="sr-only">Logout action</DialogTitle>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <ChevronLeft className="!size-6" />
        </Button>
      </DialogHeader>
      <div className="flex flex-col items-center text-center py-4 px-10">
        <LogOut className="text-red-500 size-12 mb-5" />
        <p className="font-medium mb-5">Are you sure you want to logout?</p>
        <p className="text-gray-500">You’ll need to sign in again to access your account.</p>
      </div>
      <div className="p-4 flex space-x-4">
        <Button className="flex-1" type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          className="flex-1 bg-red-100 text-red-500"
          type="button"
          variant="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </DialogContent>
  );
}

export default function HeaderRight() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(-1);

  return (
    <div className="flex flex-row items-center gap-6">
      {/* <RightSideDrawer /> */}
      {/* <div className="w-[2px] h-10 bg-border" /> */}
      <div className="flex flex-row gap-3 justify-center items-center" onClick={() => setIsOpen(1)}>
        <Avatar className="rounded-sm size-10">
          <AvatarImage src={user?.profileUrl} alt="profile-picture" />
          <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user?.username}</p>
          <p>{user?.type}</p>
        </div>
      </div>
      <Dialog open={isOpen != -1} onOpenChange={() => setIsOpen(-1)}>
        {isOpen == 1 && (
          <ProfileDialogContent
            {...{
              user,
              handleLogout: () => setIsOpen(2),
              handleChangePw: () => setIsOpen(3)
            }}
          />
        )}
        {isOpen == 2 && <LogoutDialogContent {...{ handleClose: () => setIsOpen(1) }} />}
        {isOpen == 3 && <PasswordDialogContent {...{ user, handleClose: () => setIsOpen(1) }} />}
      </Dialog>
    </div>
  );
}
