import { logout } from '@/lib/actions';
import { redirect } from 'next/navigation';

export async function POST() {
  await logout();
  return redirect('/login');
}
