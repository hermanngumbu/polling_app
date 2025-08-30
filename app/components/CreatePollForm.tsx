'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { createPoll } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const initialState = { error: '' };

export function CreatePollForm() {
  const [state, formAction] = useFormState(createPoll, initialState);
  const [options, setOptions] = useState(['', '']);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Poll Question</Label>
        <Input id="question" name="question" placeholder="What's your favorite color?" required />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        {options.map((option, index) => (
          <Input
            key={index}
            name="option"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleAddOption}>
          Add Option
        </Button>
        <Button type="submit">Create Poll</Button>
      </div>
    </form>
  );
}
