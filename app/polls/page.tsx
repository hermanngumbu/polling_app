import { getPolls } from '@/lib/db';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PollsPage() {
  const polls = await getPolls();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Polls</h1>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>
      {polls.length > 0 ? (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <Link href={`/polls/${poll.id}`} key={poll.id}>
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <CardHeader>
                  <CardTitle>{poll.question}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">No polls available.</p>
          <p>Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}