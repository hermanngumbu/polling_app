
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
}

export function QRCodeModal({ url, onClose }: QRCodeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Share Poll</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <QRCodeSVG value={url} size={256} />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Scan this QR code to view and vote in the poll.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
