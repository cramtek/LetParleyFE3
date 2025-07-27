import { useState } from 'react';
import {
  getContactIdFromMessages,
  getContactInfoFromConversation,
  sendManualMessage,
} from '../services/messageService';
import { useConversationsStore } from '../store/conversationsStore';
import { useMessagesStore } from '../store/messagesStore';

interface UseSendMessageReturn {
  sendMessage: (threadId: string, message: string) => Promise<boolean>;
  isSending: boolean;
  error: string | null;
  clearError: () => void;
}

export const useSendMessage = (): UseSendMessageReturn => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { conversations, updateConversation } = useConversationsStore();
  const { addMessage } = useMessagesStore();

  const sendMessage = async (threadId: string, message: string): Promise<boolean> => {
    if (!message.trim()) {
      setError('El mensaje no puede estar vacío');
      return false;
    }

    // Find the conversation to get contact information
    const conversation = conversations.find((conv) => conv.OpenAID === threadId);
    if (!conversation) {
      setError('No se encontró la conversación');
      return false;
    }

    // Check if it's a supported contact type - NOW INCLUDING WIDGET
    const supportedTypes = ['whatsapp', 'instagram', 'widget', 'webchat'];
    const contactType = conversation.ContactType.toLowerCase();

    if (!supportedTypes.includes(contactType)) {
      setError(
        `El tipo de contacto '${conversation.ContactType}' no está implementado para envío de mensajes`,
      );
      return false;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log('Attempting to send message:', {
        threadId,
        contactType: conversation.ContactType,
        showName: conversation.ShowName,
        messagePreview: message.substring(0, 50) + '...',
      });

      // First try to get contact info from conversation
      let contactInfo = getContactInfoFromConversation(conversation);

      // If we don't have contact info, try to get ContactId from messages
      if (!contactInfo) {
        console.log('ContactId not found in conversation, fetching from messages...');
        const contactId = await getContactIdFromMessages(threadId);

        if (!contactId) {
          setError('No se pudo obtener el ID del contacto para enviar el mensaje');
          return false;
        }

        // Determine the correct contact type format for the API
        let apiContactType = 'Whatsapp'; // Default
        if (contactType === 'instagram') {
          apiContactType = 'Instagram';
        } else if (contactType === 'widget' || contactType === 'webchat') {
          apiContactType = 'Widget';
        }

        contactInfo = {
          contactId: contactId,
          contactType: apiContactType,
        };
      }

      console.log('Using contact info:', contactInfo);

      // Send the message through the API
      const result = await sendManualMessage({
        OpenAID: threadId,
        ContactId: contactInfo.contactId,
        ContactType: contactInfo.contactType,
        newMessage: message,
      });

      if (!result.success) {
        setError(result.error || 'Error al enviar el mensaje');
        return false;
      }

      // Create the message object to add to the conversation
      // Messages sent by the business should be marked as IsBot: true
      // This makes them appear on the right side (business/assistant side)
      const newMessage = {
        Content: message,
        IsBot: true, // This is a message from the business/assistant, not the client
        DateRegistered: new Date().toISOString(),
        PhotoURL: '',
        ActionURL: '',
      };

      // Add the message to the store immediately
      addMessage(threadId, newMessage);

      // Update the conversation with the latest message
      updateConversation(threadId, {
        LastMessage: message,
        LastMessageDateRegistered: newMessage.DateRegistered,
      });

      console.log('Message sent and added to conversation successfully');
      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    sendMessage,
    isSending,
    error,
    clearError,
  };
};
