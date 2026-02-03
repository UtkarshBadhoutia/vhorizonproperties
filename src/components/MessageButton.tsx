import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useMessages } from '@/hooks/useMessages';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MessageButtonProps {
    propertyId: number;
    agentId: string;
    propertyTitle: string;
}

export function MessageButton({ propertyId, agentId, propertyTitle }: MessageButtonProps) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { messages, sendMessage, isSending } = useMessages(propertyId, agentId);

    const handleSend = () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        sendMessage(
            {
                propertyId,
                receiverId: agentId,
                message: message.trim(),
            },
            {
                onSuccess: () => {
                    setMessage('');
                    toast.success('Message sent!');
                },
                onError: () => {
                    toast.error('Failed to send message');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Agent
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-white">Message Agent</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        About: {propertyTitle}
                    </DialogDescription>
                </DialogHeader>

                {/* Message history */}
                <div className="flex-1 overflow-y-auto space-y-3 py-4 min-h-[200px] max-h-[300px]">
                    {messages.length === 0 ? (
                        <div className="text-center text-zinc-500 py-8">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender_id === agentId ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${msg.sender_id === agentId
                                            ? 'bg-zinc-800 text-white'
                                            : 'bg-primary text-primary-foreground'
                                        }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message input */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-zinc-950/50 border-zinc-800 text-white resize-none"
                        rows={3}
                        disabled={isSending}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-zinc-500">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                        <Button onClick={handleSend} disabled={isSending || !message.trim()}>
                            {isSending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 mr-2" />
                            )}
                            Send
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
