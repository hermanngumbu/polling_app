'use client';

import { CreatePollForm } from '@/components/CreatePollForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import withAuth from '@/components/withAuth';

function CreatePollPage() {
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

export default withAuth(CreatePollPage);
