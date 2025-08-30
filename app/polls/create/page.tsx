import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CreatePollForm } from '@/components/CreatePollForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreatePollPage() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    redirect('/login');
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePollForm />
        </CardContent>
      </Card>
    </div>
  );
}