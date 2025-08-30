import { getPollById } from '@/lib/db'; 
import { submitVote } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function PollPage({ params }: { params: { id: string } }) {
  const pollId = parseInt(params.id, 10);
  const poll = await getPollById(pollId);

  if (!poll) {
    notFound();
  }

  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-2">
            {poll.options.map((option) => (
              <Button
                key={option.id}
                formAction={async () => {
                  'use server';
                  await submitVote(poll.id, option.id);
                }}
                className="w-full justify-start h-auto py-3 px-4 whitespace-normal"
                variant="outline"
              >
                {option.text}
              </Button>
            ))}
          </form>
          <div className="pt-4 space-y-2">
            <h3 className="text-lg font-semibold">Results</h3>
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>{option.text}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {option.votes} vote(s)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
             <p className="text-sm text-right text-gray-500 dark:text-gray-400">Total Votes: {totalVotes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}