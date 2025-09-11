import { getPollById } from '@/lib/db';
import { notFound } from 'next/navigation';
import { PollClientPage } from './client-page';

export default async function PollPage({ params }: { params: { id: string } }) {
  const pollId = params.id;
  const poll = await getPollById(pollId);

  if (!poll) {
    notFound();
  }

  return <PollClientPage poll={poll} />;
}
