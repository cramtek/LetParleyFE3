import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Send, X } from 'lucide-react';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useConversationsStore } from '../../store/conversationsStore';
import EmojiPicker from './EmojiPicker';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedConversationId, conversations } = useConversationsStore();
  const { sendMessage, isSending, error, clearError } = useSendMessage();

  const selectedConversation = conversations.find((c) => c.OpenAID === selectedConversationId);

  // Check if the contact type supports sending messages - NOW INCLUDING WIDGET
  const supportedTypes = ['whatsapp', 'instagram', 'widget', 'webchat'];
  const canSendMessage = selectedConversation?.ContactType?.toLowerCase()
    ? supportedTypes.includes(selectedConversation.ContactType.toLowerCase())
    : false;

  // Auto-focus the textarea when conversation changes or after sending a message
  useEffect(() => {
    if (textareaRef.current && selectedConversationId && canSendMessage && !isSending) {
      textareaRef.current.focus();
    }
  }, [selectedConversationId, canSendMessage, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedConversationId || isSending) return;

    // Clear any previous errors
    clearError();

    // Send the message
    const success = await sendMessage(selectedConversationId, message);

    if (success) {
      // Clear input on successful send
      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';

        // Re-focus the textarea after sending
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  if (!selectedConversationId) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-gray-500">Select a conversation to start messaging</div>
      </div>
    );
  }

  if (!canSendMessage) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-gray-500">
          This contact type doesn't support sending messages
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
            <button onClick={clearError} className="ml-auto p-1 hover:bg-red-100 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-2">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
              rows={1}
              disabled={isSending}
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
