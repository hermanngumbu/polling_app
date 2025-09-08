import { getPollById } from '@/lib/db';
import { notFound } from 'next/navigation';
import { PollClientPage } from './client-page';

export default async function PollPage({ params }: { params: { id: string } }) {
  const pollId = parseInt(params.id, 10);
  const poll = await getPollById(pollId);

  if (!poll) {
    notFound();
  }

  return <PollClientPage poll={poll} />;
}
