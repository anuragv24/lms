import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

export default async function RootPage() {
  let isTokenValid = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('next-auth.session-token')?.value;

    if (token) {
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secretKey);
      isTokenValid = true;
    }
  } catch (error) {
    isTokenValid = false;
  }

  if (isTokenValid) {
    redirect('/books');
  } else {
    redirect('/login');
  }
  return null;
}