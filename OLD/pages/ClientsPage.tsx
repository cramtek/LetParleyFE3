import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Tag,
  Users,
  X,
} from 'lucide-react';
import {
  Client,
  formatClientAddress,
  getClientContactInfo,
  parseClientTags,
} from '../services/clientService';
import { useClientStore } from '../store/clientStore';
import { formatToUserTimezone } from '../utils/timezone';

const ClientsPage = () => {
  const {
    clients,
    selectedClient,
    currentPage,
    pageSize,
    totalPages,
    totalClients,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    isLoading,
    isSaving,
    error,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    fetchClients,
    fetchClientById,
    clearSelectedClient,
    clearError,
  } = useClientStore();

  const [showClientModal, setShowClientModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Fetch clients on component mount and when filters change
  useEffect(() => {
    fetchClients();
  }, [fetchClients, currentPage, statusFilter, sortBy, sortOrder]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchQuery, setCurrentPage]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleViewClient = async (client: Client) => {
    await fetchClientById(client.client_profile_id);
    setModalMode('view');
    setShowClientModal(true);
  };

  const handleEditClient = async (client: Client) => {
    await fetchClientById(client.client_profile_id);
    setModalMode('edit');
    setShowClientModal(true);
  };

  const handleCreateClient = () => {
    clearSelectedClient();
    setModalMode('create');
    setShowClientModal(true);
  };

  const handleCloseModal = () => {
    setShowClientModal(false);
    clearSelectedClient();
  };

  const formatDate = (dateString: string) => {
    return formatToUserTimezone(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
    );
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  // Safe function to get client tags with null safety
  const getSafeClientTags = (client: Client | null) => {
    if (!client) return [];
    const tags = parseClientTags(client.tags);
    return Array.isArray(tags) ? tags : [];
  };

  // Safe function to get clients array with null safety
  const getSafeClients = () => {
    return Array.isArray(clients) ? clients : [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra la información de tus clientes</p>
        </div>
        <button
          onClick={handleCreateClient}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="All">Todos los estados</option>
              <option value="Active">Activos</option>
              <option value="Inactive">Inactivos</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-end text-sm text-gray-600">
            {totalClients > 0 && (
              <span>
                Mostrando {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, totalClients)} de {totalClients} clientes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : getSafeClients().length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'All'
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Comienza agregando tu primer cliente'}
            </p>
            {!searchQuery && statusFilter === 'All' && (
              <button
                onClick={handleCreateClient}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Primer Cliente
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('client_name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Nombre</span>
                        {getSortIcon('client_name')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('client_status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Estado</span>
                        {getSortIcon('client_status')}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('date_registered')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Registrado</span>
                        {getSortIcon('date_registered')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiquetas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSafeClients().map((client) => {
                    const clientTags = getSafeClientTags(client);
                    return (
                      <tr key={client.client_profile_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {client.profile_image_url ? (
                              <img
                                src={client.profile_image_url}
                                alt={client.client_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.client_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {client.client_profile_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getClientContactInfo(client) || 'Sin contacto'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {client.city && client.country
                              ? `${client.city}, ${client.country}`
                              : client.city || client.country || 'Sin ubicación'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(client.client_status)}>
                            {client.client_status === 'Active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(client.date_registered)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {clientTags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {clientTags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{clientTags.length - 2} más
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewClient(client)}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded"
                              title="Ver cliente"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditClient(client)}
                              className="text-primary hover:text-primary-dark p-1 rounded"
                              title="Editar cliente"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {getSafeClients().map((client) => {
                const clientTags = getSafeClientTags(client);
                return (
                  <div key={client.client_profile_id} className="p-4">
                    <div className="flex items-start space-x-3">
                      {client.profile_image_url ? (
                        <img
                          src={client.profile_image_url}
                          alt={client.client_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-500" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {client.client_name}
                          </h3>
                          <span className={getStatusBadge(client.client_status)}>
                            {client.client_status === 'Active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>

                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600">
                            {getClientContactInfo(client) || 'Sin contacto'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {client.city && client.country
                              ? `${client.city}, ${client.country}`
                              : client.city || client.country || 'Sin ubicación'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Registrado: {formatDate(client.date_registered)}
                          </p>
                        </div>

                        {clientTags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {clientTags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center space-x-3">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="text-sm text-primary hover:text-primary-dark flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>

                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Página <span className="font-medium">{currentPage}</span> de{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum =
                            Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-primary border-primary text-white'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Client Modal */}
      {showClientModal && (
        <ClientModal
          client={selectedClient}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={() => {
            handleCloseModal();
            fetchClients();
          }}
        />
      )}
    </div>
  );
};

// Client Modal Component
const ClientModal = ({
  client,
  mode,
  onClose,
  onSave,
}: {
  client: Client | null;
  mode: 'view' | 'edit' | 'create';
  onClose: () => void;
  onSave: () => void;
}) => {
  const { createClient, updateClient, isSaving } = useClientStore();
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    phone_number: '',
    birth_date: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    client_status: 'Active' as 'Active' | 'Inactive',
  });

  useEffect(() => {
    if (client && (mode === 'view' || mode === 'edit')) {
      setFormData({
        client_name: client.client_name || '',
        email: client.email || '',
        phone_number: client.phone_number || '',
        birth_date: client.birth_date || '',
        address: client.address || '',
        city: client.city || '',
        country: client.country || '',
        postal_code: client.postal_code || '',
        client_status: client.client_status || 'Active',
      });
    }
  }, [client, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (mode === 'create') {
      success = await createClient(formData);
    } else if (mode === 'edit' && client) {
      success = await updateClient(client.client_profile_id, formData);
    }

    if (success) {
      onSave();
    }
  };

  // Safe function to get client tags for modal with null safety
  const getSafeClientTags = (client: Client | null) => {
    if (!client) return [];
    const tags = parseClientTags(client.tags);
    return Array.isArray(tags) ? tags : [];
  };

  const formatDate = (dateString: string) => {
    return formatToUserTimezone(dateString);
  };

  const isReadOnly = mode === 'view';
  const title =
    mode === 'create'
      ? 'Crear Cliente'
      : mode === 'edit'
        ? 'Editar Cliente'
        : 'Información del Cliente';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  readOnly={isReadOnly}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.client_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      client_status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                >
                  <option value="Active">Activo</option>
                  <option value="Inactive">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  readOnly={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  readOnly={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  readOnly={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  readOnly={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    readOnly={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    readOnly={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    readOnly={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info for View Mode */}
          {mode === 'view' && client && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">ID del Cliente:</span>
                  <span className="ml-2 text-gray-900">{client.client_profile_id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fecha de Registro:</span>
                  <span className="ml-2 text-gray-900">{formatDate(client.date_registered)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Última Actualización:</span>
                  <span className="ml-2 text-gray-900">{formatDate(client.last_updated)}</span>
                </div>
                {client.last_interaction && (
                  <div>
                    <span className="font-medium text-gray-700">Última Interacción:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(client.last_interaction)}
                    </span>
                  </div>
                )}
              </div>

              {getSafeClientTags(client).length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Etiquetas:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getSafeClientTags(client).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {mode === 'view' ? 'Cerrar' : 'Cancelar'}
            </button>

            {mode !== 'view' && (
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsPage;
