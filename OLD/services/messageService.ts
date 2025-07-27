import { useAuthStore } from '../store/authStore';

export interface SendMessageRequest {
  OpenAID: string;
  ContactId: string;
  ContactType: string;
  newMessage: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Clean WhatsApp contact ID by removing the + symbol if present
 */
const cleanWhatsAppContactId = (contactId: string, contactType: string): string => {
  // Only clean for WhatsApp contacts
  if (contactType.toLowerCase() === 'whatsapp' && contactId.startsWith('+')) {
    const cleaned = contactId.substring(1);
    console.log('Cleaned WhatsApp contact ID:', {
      original: contactId,
      cleaned: cleaned,
    });
    return cleaned;
  }

  return contactId;
};

/**
 * Send a manual message through the LetParley API
 */
export const sendManualMessage = async (
  request: SendMessageRequest,
): Promise<SendMessageResponse> => {
  const { sessionToken } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  // Clean the contact ID for WhatsApp (Instagram and Widget don't need cleaning)
  const cleanedRequest = {
    ...request,
    ContactId: cleanWhatsAppContactId(request.ContactId, request.ContactType),
  };

  try {
    console.log('Sending manual message:', {
      threadId: cleanedRequest.OpenAID,
      contactType: cleanedRequest.ContactType,
      originalContactId: request.ContactId,
      cleanedContactId: cleanedRequest.ContactId,
      messageLength: cleanedRequest.newMessage.length,
    });

    const response = await fetch('https://api3.letparley.com/send_manual_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(cleanedRequest),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Failed to send message:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText,
        requestData: {
          ...cleanedRequest,
          newMessage: cleanedRequest.newMessage.substring(0, 50) + '...',
        },
      });

      // Handle specific error cases
      if (response.status === 400) {
        if (responseText.includes('Missing required fields')) {
          throw new Error('Faltan campos requeridos en la solicitud');
        } else if (responseText.includes('Invalid WhatsApp credentials')) {
          throw new Error('Credenciales de WhatsApp inválidas');
        } else if (responseText.includes('Invalid Instagram credentials')) {
          throw new Error('Credenciales de Instagram inválidas');
        } else if (responseText.includes('Invalid Widget credentials')) {
          throw new Error('Credenciales de Widget inválidas');
        } else if (responseText.includes('Missing required data')) {
          throw new Error('Faltan datos requeridos');
        } else if (responseText.includes('Failed to send message')) {
          throw new Error('Error al enviar el mensaje');
        } else if (responseText.includes('not implemented')) {
          throw new Error(`El tipo de contacto '${request.ContactType}' no está implementado`);
        }
      } else if (response.status === 401) {
        useAuthStore.getState().signOut();
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }

      throw new Error(`Error del servidor: ${response.status} - ${responseText}`);
    }

    console.log('Message sent successfully:', {
      response: responseText,
      contactId: cleanedRequest.ContactId,
      contactType: cleanedRequest.ContactType,
    });

    return {
      success: true,
      message: responseText,
    };
  } catch (error) {
    console.error('Error sending manual message:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'Error desconocido al enviar el mensaje',
    };
  }
};

/**
 * Extract contact information from a conversation for sending messages
 */
export const getContactInfoFromConversation = (
  conversation: any,
): { contactId: string; contactType: string } | null => {
  if (!conversation) {
    console.error('No conversation provided');
    return null;
  }

  console.log('Extracting contact info from conversation:', {
    OpenAID: conversation.OpenAID,
    ContactType: conversation.ContactType,
    ShowName: conversation.ShowName,
    conversationKeys: Object.keys(conversation),
  });

  const contactType = conversation.ContactType;

  // Handle WhatsApp contacts
  if (contactType === 'Whatsapp' || contactType === 'WhatsApp') {
    let contactId =
      conversation.ContactId ||
      conversation.PhoneNumber ||
      conversation.Phone ||
      conversation.ContactID ||
      conversation.contact_id ||
      conversation.phone_number;

    if (!contactId) {
      console.warn(
        'ContactId not found in WhatsApp conversation object. Available fields:',
        Object.keys(conversation),
      );
      return null;
    }

    console.log('Found WhatsApp contact ID:', contactId);

    return {
      contactId: contactId.toString(),
      contactType: 'Whatsapp', // Ensure consistent casing
    };
  }

  // Handle Instagram contacts
  if (contactType === 'Instagram' || contactType === 'instagram') {
    let contactId =
      conversation.ContactId ||
      conversation.InstagramId ||
      conversation.instagram_id ||
      conversation.ContactID ||
      conversation.contact_id;

    if (!contactId) {
      console.warn(
        'ContactId not found in Instagram conversation object. Available fields:',
        Object.keys(conversation),
      );
      return null;
    }

    console.log('Found Instagram contact ID:', contactId);

    return {
      contactId: contactId.toString(),
      contactType: 'Instagram', // Ensure consistent casing
    };
  }

  // Handle Widget contacts
  if (
    contactType === 'Widget' ||
    contactType === 'widget' ||
    contactType === 'Webchat' ||
    contactType === 'webchat'
  ) {
    let contactId =
      conversation.ContactId ||
      conversation.WidgetId ||
      conversation.widget_id ||
      conversation.WebchatId ||
      conversation.webchat_id ||
      conversation.ContactID ||
      conversation.contact_id;

    if (!contactId) {
      console.warn(
        'ContactId not found in Widget conversation object. Available fields:',
        Object.keys(conversation),
      );
      return null;
    }

    console.log('Found Widget contact ID:', contactId);

    return {
      contactId: contactId.toString(),
      contactType: 'Widget', // Ensure consistent casing
    };
  }

  // For other contact types, return null since they're not implemented
  console.warn(`Contact type '${contactType}' is not supported for sending messages`);
  return null;
};

/**
 * Get contact ID from the first message in a conversation
 * This is needed because the conversation object doesn't always contain the ContactId
 */
export const getContactIdFromMessages = async (threadId: string): Promise<string | null> => {
  const { sessionToken } = useAuthStore.getState();

  if (!sessionToken) {
    console.error('No session token available');
    return null;
  }

  try {
    console.log('Fetching messages to extract ContactId for thread:', threadId);

    const response = await fetch('https://api3.letparley.com/lpmobile/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        thread_id: threadId,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch messages for ContactId extraction:', response.status);
      return null;
    }

    const messages = await response.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      console.error('No messages found to extract ContactId');
      return null;
    }

    // Get ContactId from the first message
    const firstMessage = messages[0];
    const contactId = firstMessage.ContactId;

    if (!contactId) {
      console.error('ContactId not found in message:', firstMessage);
      return null;
    }

    console.log('Extracted ContactId from messages:', contactId);
    return contactId;
  } catch (error) {
    console.error('Error fetching ContactId from messages:', error);
    return null;
  }
};
