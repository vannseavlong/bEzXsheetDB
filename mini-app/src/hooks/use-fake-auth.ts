import Cookies from 'node_modules/@types/js-cookie';
import useAuthStore from './store/use-auth-store';
import { useEffect } from 'react';

const useFakeAuth = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fakeResponse: LoginResponseProps = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTM4MiwidXNlcm5hbWUiOiIwNzc3NzY4MDAiLCJpYXQiOjE3NjQ3NTk0NjAsImV4cCI6MTc2NzM1MTQ2MH0.g7caDlfnr8DKkzifg6RdawJRsYxWf0SgMl9w2ybMe0o',
      // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE1LCJ1c2VybmFtZSI6Ijg1NTkyMzUyNDQyIiwiaWF0IjoxNzU4MjYzMjU0LCJleHAiOjE3NjA4NTUyNTR9.TbcZnpObfIK-zR1OA4m6jmrr3jg-vH7AFaYLMxmzaR0',
      userInfo: {
        profileUrl:
          'https://api-dev.beasy.info/uploads/profileFile-80bc3f22-77cf-4f24-ac90-94a2e2ffab83.jpg',
        referralCode: '086585891',
        id: 1,
        username: '85586585891',
        password: null,
        firstName: 'Lymeng',
        lastName: 'GGWp',
        balance: 19964029.9,
        language: 'en',
        email: 'lymeng.pen@suntel.com',
        status: 'ACTIVE',
        type: 'USER',
        referrerCode: null,
        gender: 'FEMALE',
        dob: '1999-07-07',
        description: '',
        count: 21,
        fcmToken: 'TOKEN-124-ABC',
        deviceId: 'DEVICE-123-ABC',
        createdAt: '2025-05-19T04:40:04.000Z',
        updatedAt: '2025-09-10T01:12:42.000Z'
      }
    };
    Cookies.set('token', fakeResponse.token, { expires: 30 });
    setUser(fakeResponse.userInfo);
  }, [setUser]);
};

export default useFakeAuth;
