import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Tag,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import {
  Client,
  ClientNote,
  clientApi,
  formatClientAddress,
  getClientContactInfo,
  parseClientTags,
} from '../../services/clientService';
import { useAuthStore } from '../../store/authStore';
import { useClientStore } from '../../store/clientStore';
import { useConversationsStore } from '../../store/conversationsStore';

const ContactTypeIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'whatsapp':
      return (
        <div className="h-5 w-5 rounded bg-green-500 flex items-center justify-center text-white text-xs font-bold">
          W
        </div>
      );
    case 'instagram':
      return (
        <div className="h-5 w-5 rounded bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
          I
        </div>
      );
    case 'webchat':
      return (
        <div className="h-5 w-5 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
          C
        </div>
      );
    default:
      return (
        <div className="h-5 w-5 rounded bg-gray-500 flex items-center justify-center text-white text-xs font-bold">
          ?
        </div>
      );
  }
};

interface ContactInfoPanelProps {
  onClose: () => void;
  isOpen: boolean;
  isMobile?: boolean;
}

const ContactInfoPanel = ({ onClose, isOpen, isMobile = false }: ContactInfoPanelProps) => {
  const { selectedConversationId, conversations } = useConversationsStore();
  const { selectedBusinessId } = useAuthStore();
  const [client, setClient] = useState<Client | null>(null);
  const [clientNotes, setClientNotes] = useState<ClientNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const selectedConversation = conversations.find((c) => c.OpenAID === selectedConversationId);

  // Form data for editing client
  const [editFormData, setEditFormData] = useState({
    client_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
  });

  // Safe function to get client tags
  const getSafeClientTags = (client: Client | null) => {
    if (!client) return [];
    const tags = parseClientTags(client.tags);
    return Array.isArray(tags) ? tags : [];
  };

  // Search for client by conversation info
  useEffect(() => {
    const searchClient = async () => {
      if (!selectedConversation || !selectedBusinessId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Try to find client by name or phone number
        const searchQuery = selectedConversation.ShowName;
        const response = await clientApi.getClients({ search: searchQuery, page_size: 10 });

        // Add null safety check for response.clients
        if (
          response &&
          response.clients &&
          Array.isArray(response.clients) &&
          response.clients.length > 0
        ) {
          // Find the best match
          const exactMatch = response.clients.find(
            (c) => c.client_name.toLowerCase() === selectedConversation.ShowName.toLowerCase(),
          );

          const foundClient = exactMatch || response.clients[0];
          setClient(foundClient);

          // Load client notes
          await loadClientNotes(foundClient.client_profile_id);

          // Set edit form data
          setEditFormData({
            client_name: foundClient.client_name || '',
            email: foundClient.email || '',
            phone_number: foundClient.phone_number || '',
            address: foundClient.address || '',
            city: foundClient.city || '',
            country: foundClient.country || '',
            postal_code: foundClient.postal_code || '',
          });
        } else {
          // No client found, prepare for creation
          setClient(null);
          setEditFormData({
            client_name: selectedConversation.ShowName || '',
            email: '',
            phone_number: '',
            address: '',
            city: '',
            country: '',
            postal_code: '',
          });
        }
      } catch (error) {
        console.error('Error searching for client:', error);
        setError('Error al buscar información del cliente');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedConversationId && isOpen) {
      searchClient();
    }
  }, [selectedConversationId, selectedConversation, selectedBusinessId, isOpen]);

  const loadClientNotes = async (clientId: number) => {
    setIsLoadingNotes(true);
    try {
      const notes = await clientApi.getClientNotes(clientId);
      setClientNotes(Array.isArray(notes) ? notes : []);
    } catch (error) {
      console.error('Error loading client notes:', error);
      setClientNotes([]);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleSaveClient = async () => {
    if (!selectedConversation) return;

    setIsLoading(true);
    setError(null);

    try {
      if (client) {
        // Update existing client
        await clientApi.updateClient(client.client_profile_id, editFormData);

        // Refresh client data
        const updatedClient = await clientApi.getClientById(client.client_profile_id);
        setClient(updatedClient);
      } else {
        // Create new client
        const result = await clientApi.createClient(editFormData);

        // Load the newly created client
        const newClient = await clientApi.getClientById(result.client_id);
        setClient(newClient);
        await loadClientNotes(newClient.client_profile_id);
      }

      setIsEditingClient(false);
    } catch (error) {
      console.error('Error saving client:', error);
      setError('Error al guardar la información del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!client || !newNote.trim()) return;

    setIsAddingNote(true);
    try {
      await clientApi.addClientNote(client.client_profile_id, {
        note_content: newNote.trim(),
      });

      // Refresh notes
      await loadClientNotes(client.client_profile_id);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Error al agregar la nota');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleAddTag = async () => {
    if (!client || !newTag.trim()) return;

    setIsAddingTag(true);
    try {
      await clientApi.assignTag(client.client_profile_id, {
        tag_name: newTag.trim(),
      });

      // Refresh client data to get updated tags
      const updatedClient = await clientApi.getClientById(client.client_profile_id);
      setClient(updatedClient);
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
      setError('Error al agregar la etiqueta');
    } finally {
      setIsAddingTag(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!selectedConversation) return null;

  // Mobile version - overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Panel - positioned below topbar */}
        <div
          className={`
          fixed top-16 bottom-0 right-0 z-[100] md:hidden
          w-full bg-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        >
          {/* Header with close button */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation bg-gray-50 border border-gray-200"
              aria-label="Cerrar panel"
              type="button"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <ContactInfoContent
              selectedConversation={selectedConversation}
              client={client}
              clientNotes={clientNotes}
              isLoading={isLoading}
              isLoadingNotes={isLoadingNotes}
              error={error}
              isEditingClient={isEditingClient}
              editFormData={editFormData}
              newNote={newNote}
              isAddingNote={isAddingNote}
              newTag={newTag}
              isAddingTag={isAddingTag}
              setError={setError}
              setIsEditingClient={setIsEditingClient}
              setEditFormData={setEditFormData}
              setNewNote={setNewNote}
              setNewTag={setNewTag}
              handleSaveClient={handleSaveClient}
              handleAddNote={handleAddNote}
              handleAddTag={handleAddTag}
              formatDate={formatDate}
              getSafeClientTags={getSafeClientTags}
            />
          </div>
        </div>
      </>
    );
  }

  // Desktop version - sidebar
  return (
    <div className="w-80 bg-white flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Información del Cliente</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Cerrar panel"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ContactInfoContent
          selectedConversation={selectedConversation}
          client={client}
          clientNotes={clientNotes}
          isLoading={isLoading}
          isLoadingNotes={isLoadingNotes}
          error={error}
          isEditingClient={isEditingClient}
          editFormData={editFormData}
          newNote={newNote}
          isAddingNote={isAddingNote}
          newTag={newTag}
          isAddingTag={isAddingTag}
          setError={setError}
          setIsEditingClient={setIsEditingClient}
          setEditFormData={setEditFormData}
          setNewNote={setNewNote}
          setNewTag={setNewTag}
          handleSaveClient={handleSaveClient}
          handleAddNote={handleAddNote}
          handleAddTag={handleAddTag}
          formatDate={formatDate}
          getSafeClientTags={getSafeClientTags}
        />
      </div>
    </div>
  );
};

// Extracted content component to avoid duplication
const ContactInfoContent = ({
  selectedConversation,
  client,
  clientNotes,
  isLoading,
  isLoadingNotes,
  error,
  isEditingClient,
  editFormData,
  newNote,
  isAddingNote,
  newTag,
  isAddingTag,
  setError,
  setIsEditingClient,
  setEditFormData,
  setNewNote,
  setNewTag,
  handleSaveClient,
  handleAddNote,
  handleAddTag,
  formatDate,
  getSafeClientTags,
}: any) => {
  return (
    <div className="p-4 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Basic Info */}
      {!isLoading && (
        <div className="text-center">
          {selectedConversation.ProfileImageURL ? (
            <img
              src={selectedConversation.ProfileImageURL}
              alt={selectedConversation.ShowName}
              className="h-24 w-24 rounded-full mx-auto object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          )}

          <div className="mt-3">
            {isEditingClient ? (
              <input
                type="text"
                value={editFormData.client_name}
                onChange={(e) => setEditFormData({ ...editFormData, client_name: e.target.value })}
                className="text-center font-medium text-gray-900 border-b border-gray-300 focus:border-primary focus:outline-none"
                placeholder="Nombre del cliente"
              />
            ) : (
              <h4 className="font-medium text-gray-900">
                {client?.client_name || selectedConversation.ShowName}
              </h4>
            )}

            <div className="mt-1 flex items-center justify-center text-sm text-gray-500">
              <ContactTypeIcon type={selectedConversation.ContactType} />
              <span className="ml-1">{selectedConversation.ContactType}</span>
            </div>

            {client && (
              <div className="mt-2 text-xs text-gray-500">
                Cliente ID: {client.client_profile_id}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Client Information */}
      {!isLoading && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-700">
              <User className="h-4 w-4 mr-2" />
              <h4 className="font-medium">Información del Cliente</h4>
            </div>
            <button
              onClick={() => {
                if (isEditingClient) {
                  handleSaveClient();
                } else {
                  setIsEditingClient(true);
                }
              }}
              className="text-primary hover:text-primary-dark text-sm flex items-center"
              disabled={isLoading}
            >
              {isEditingClient ? (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Guardar
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  {client ? 'Editar' : 'Crear'}
                </>
              )}
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Email */}
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              {isEditingClient ? (
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="flex-1 border-b border-gray-300 focus:border-primary focus:outline-none text-sm"
                  placeholder="Email"
                />
              ) : (
                <span className="text-gray-600">{client?.email || 'Sin email'}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              {isEditingClient ? (
                <input
                  type="tel"
                  value={editFormData.phone_number}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone_number: e.target.value })
                  }
                  className="flex-1 border-b border-gray-300 focus:border-primary focus:outline-none text-sm"
                  placeholder="Teléfono"
                />
              ) : (
                <span className="text-gray-600">{client?.phone_number || 'Sin teléfono'}</span>
              )}
            </div>

            {/* Address */}
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              {isEditingClient ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full border-b border-gray-300 focus:border-primary focus:outline-none text-sm"
                    placeholder="Dirección"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="border-b border-gray-300 focus:border-primary focus:outline-none text-sm"
                      placeholder="Ciudad"
                    />
                    <input
                      type="text"
                      value={editFormData.country}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, country: e.target.value })
                      }
                      className="border-b border-gray-300 focus:border-primary focus:outline-none text-sm"
                      placeholder="País"
                    />
                  </div>
                  <input
                    type="text"
                    value={editFormData.postal_code}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, postal_code: e.target.value })
                    }
                    className="w-full border-b border-gray-300 focus:border-primary focus:outline-none text-sm"
                    placeholder="Código postal"
                  />
                </div>
              ) : (
                <span className="text-gray-600">
                  {formatClientAddress(client) || 'Sin dirección'}
                </span>
              )}
            </div>

            {/* Registration Date */}
            {client && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-600">
                  Registrado: {formatDate(client.date_registered)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {!isLoading && client && (
        <div>
          <div className="flex items-center text-sm text-gray-700 mb-3">
            <Tag className="h-4 w-4 mr-2" />
            <h4 className="font-medium">Etiquetas</h4>
          </div>

          <div className="space-y-2">
            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2">
              {getSafeClientTags(client).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
              {getSafeClientTags(client).length === 0 && (
                <span className="text-sm text-gray-500">Sin etiquetas</span>
              )}
            </div>

            {/* Add New Tag */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nueva etiqueta"
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || isAddingTag}
                className="p-1 text-primary hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingTag ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Section */}
      {!isLoading && client && (
        <div>
          <div className="flex items-center text-sm text-gray-700 mb-3">
            <FileText className="h-4 w-4 mr-2" />
            <h4 className="font-medium">Notas</h4>
          </div>

          {/* Add New Note */}
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Añadir una nota sobre este cliente..."
              className="w-full h-20 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isAddingNote}
                className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingNote ? 'Guardando...' : 'Agregar Nota'}
              </button>
            </div>
          </div>

          {/* Existing Notes */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {isLoadingNotes ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : clientNotes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay notas para este cliente
              </p>
            ) : (
              clientNotes.map((note) => (
                <div key={note.note_id} className="bg-gray-50 rounded p-3">
                  {note.note_title && (
                    <h5 className="font-medium text-sm text-gray-900 mb-1">{note.note_title}</h5>
                  )}
                  <p className="text-sm text-gray-700 mb-2">{note.note_content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(note.created_at)}</span>
                    {note.priority && (
                      <span
                        className={`px-2 py-1 rounded-full ${
                          note.priority === 'High'
                            ? 'bg-red-100 text-red-800'
                            : note.priority === 'Normal'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {note.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoPanel;
