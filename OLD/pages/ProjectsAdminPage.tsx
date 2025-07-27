import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bug,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  Filter,
  FolderKanban,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  CreateCommentData,
  CreateProjectFromRequestData,
  Project,
  ProjectComment,
  ProjectReport,
  ProjectRequest,
  UpdateProjectStatusData,
  formatDate,
  getPriorityColor,
  getPriorityText,
  getStatusColor,
  getStatusText,
  getTypeColor,
  getTypeText,
  projectsApi,
} from '../services/projectsService';
import { useAuthStore } from '../store/authStore';

const ProjectsAdminPage = () => {
  const { userEmail } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'requests' | 'projects' | 'reports'>('requests');
  const [allRequests, setAllRequests] = useState<ProjectRequest[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allReports, setAllReports] = useState<ProjectReport[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProjectRequest | Project | null>(null);
  const [itemComments, setItemComments] = useState<ProjectComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is admin
  const isAdmin = userEmail === 'cramtek@hotmail.com';

  useEffect(() => {
    if (!isAdmin) {
      setError('No tienes permisos para acceder a esta página');
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Note: In a real implementation, these would be admin endpoints that return ALL data
      // For now, we'll use the regular endpoints
      const [requestsResponse, projectsResponse] = await Promise.all([
        projectsApi.getProjectRequests(),
        projectsApi.getProjects(),
      ]);

      if (requestsResponse.success) {
        setAllRequests(requestsResponse.data || []);
      }

      if (projectsResponse.success) {
        setAllProjects(projectsResponse.data || []);

        // Collect all reports from all projects
        const allReportsData: ProjectReport[] = [];
        for (const project of projectsResponse.data || []) {
          try {
            const reportsResponse = await projectsApi.getProjectReports(project.project_id);
            if (reportsResponse.success) {
              allReportsData.push(...(reportsResponse.data || []));
            }
          } catch (error) {
            console.warn(`Failed to load reports for project ${project.project_id}`);
          }
        }
        setAllReports(allReportsData);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadItemDetails = async (item: ProjectRequest | Project) => {
    setSelectedItem(item);
    setIsLoading(true);

    try {
      // Load comments for projects
      if ('project_id' in item) {
        const commentsResponse = await projectsApi.getProjectComments(item.project_id);
        if (commentsResponse.success) {
          setItemComments(commentsResponse.data || []);
        }
      } else {
        setItemComments([]);
      }

      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error loading item details:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar detalles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertRequest = async (request: ProjectRequest, projectName: string) => {
    setIsSubmitting(true);

    try {
      const response = await projectsApi.createProjectFromRequest(request.request_id, {
        name: projectName,
      });

      if (response.success) {
        await loadData();
        setShowConvertModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error converting request:', error);
      setError(error instanceof Error ? error.message : 'Error al convertir solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProjectStatus = async (project: Project, updates: UpdateProjectStatusData) => {
    setIsSubmitting(true);

    try {
      await projectsApi.updateProjectStatus(project.project_id, updates);
      await loadData();

      // Update selected item if it's the same project
      if (
        selectedItem &&
        'project_id' in selectedItem &&
        selectedItem.project_id === project.project_id
      ) {
        setSelectedItem({ ...selectedItem, ...updates });
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar estado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedItem || !('project_id' in selectedItem) || !newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await projectsApi.addProjectComment(selectedItem.project_id, {
        content: newComment.trim(),
      });

      if (response.success) {
        setItemComments([...itemComments, response.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error instanceof Error ? error.message : 'Error al agregar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Denegado</h3>
          <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      searchQuery === '' || request.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      searchQuery === '' || project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      searchQuery === '' || report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de Proyectos</h1>
          <p className="text-gray-600">
            Panel de administración para gestionar todos los proyectos
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Settings className="h-4 w-4" />
          <span>Acceso de administrador</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Solicitudes Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {allRequests.filter((r) => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderKanban className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Proyectos Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  allProjects.filter((p) => p.status === 'active' || p.status === 'in_progress')
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bug className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reportes Abiertos</p>
              <p className="text-2xl font-bold text-gray-900">
                {allReports.filter((r) => r.status === 'open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">
                {allProjects.filter((p) => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Solicitudes ({allRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FolderKanban className="h-4 w-4 inline mr-2" />
            Proyectos ({allProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bug className="h-4 w-4 inline mr-2" />
            Reportes ({allReports.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos los estados</option>
              {activeTab === 'requests' && (
                <>
                  <option value="pending">Pendiente</option>
                  <option value="under_review">En Revisión</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                  <option value="converted">Convertido</option>
                </>
              )}
              {activeTab === 'projects' && (
                <>
                  <option value="active">Activo</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Completado</option>
                </>
              )}
              {activeTab === 'reports' && (
                <>
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </>
              )}
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center justify-end">
            {activeTab === 'requests' &&
              `${filteredRequests.length} solicitud${filteredRequests.length !== 1 ? 'es' : ''}`}
            {activeTab === 'projects' &&
              `${filteredProjects.length} proyecto${filteredProjects.length !== 1 ? 's' : ''}`}
            {activeTab === 'reports' &&
              `${filteredReports.length} reporte${filteredReports.length !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'requests' && (
            <AdminRequestsList
              requests={filteredRequests}
              onViewRequest={loadItemDetails}
              onConvertRequest={(request) => {
                setSelectedItem(request);
                setShowConvertModal(true);
              }}
            />
          )}
          {activeTab === 'projects' && (
            <AdminProjectsList
              projects={filteredProjects}
              onViewProject={loadItemDetails}
              onUpdateStatus={handleUpdateProjectStatus}
              isSubmitting={isSubmitting}
            />
          )}
          {activeTab === 'reports' && <AdminReportsList reports={filteredReports} />}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <AdminDetailsModal
          item={selectedItem}
          comments={itemComments}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          onAddComment={handleAddComment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedItem(null);
            setItemComments([]);
            setNewComment('');
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Convert Request Modal */}
      {showConvertModal && selectedItem && 'request_id' in selectedItem && (
        <ConvertRequestModal
          request={selectedItem}
          onConvert={handleConvertRequest}
          onClose={() => {
            setShowConvertModal(false);
            setSelectedItem(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

// Admin Requests List Component
const AdminRequestsList = ({
  requests,
  onViewRequest,
  onConvertRequest,
}: {
  requests: ProjectRequest[];
  onViewRequest: (request: ProjectRequest) => void;
  onConvertRequest: (request: ProjectRequest) => void;
}) => {
  if (requests.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
        <p className="text-gray-500">No se encontraron solicitudes con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Solicitud
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.request_id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {request.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                Business ID: {request.business_id}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(request.type)}`}
                >
                  {getTypeText(request.type)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}
                >
                  {getPriorityText(request.priority)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}
                >
                  {getStatusText(request.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(request.date_created)}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onViewRequest(request)}
                    className="text-gray-600 hover:text-gray-900 p-1 rounded"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => onConvertRequest(request)}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Convertir a proyecto"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Admin Projects List Component
const AdminProjectsList = ({
  projects,
  onViewProject,
  onUpdateStatus,
  isSubmitting,
}: {
  projects: Project[];
  onViewProject: (project: Project) => void;
  onUpdateStatus: (project: Project, updates: UpdateProjectStatusData) => void;
  isSubmitting: boolean;
}) => {
  if (projects.length === 0) {
    return (
      <div className="p-12 text-center">
        <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
        <p className="text-gray-500">No se encontraron proyectos con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proyecto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Desarrollo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progreso
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.project_id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{project.name}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                Business ID: {project.business_id}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(project.type)}`}
                >
                  {getTypeText(project.type)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                >
                  {getStatusText(project.status)}
                </span>
              </td>
              <td className="px-6 py-4">
                <select
                  value={project.development_status}
                  onChange={(e) =>
                    onUpdateStatus(project, {
                      development_status: e.target.value as any,
                      development_progress:
                        e.target.value === 'delivered' ? 100 : project.development_progress,
                    })
                  }
                  disabled={isSubmitting}
                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="pending">Pendiente</option>
                  <option value="analysis">Análisis</option>
                  <option value="development">Desarrollo</option>
                  <option value="testing">Pruebas</option>
                  <option value="review">Revisión</option>
                  <option value="ready">Listo</option>
                  <option value="delivered">Entregado</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${project.development_progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{project.development_progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => onViewProject(project)}
                  className="text-gray-600 hover:text-gray-900 p-1 rounded"
                  title="Ver detalles"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Admin Reports List Component
const AdminReportsList = ({ reports }: { reports: ProjectReport[] }) => {
  if (reports.length === 0) {
    return (
      <div className="p-12 text-center">
        <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes</h3>
        <p className="text-gray-500">No se encontraron reportes con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reporte
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proyecto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report.report_id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{report.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {report.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">Proyecto ID: {report.project_id}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(report.type)}`}
                >
                  {getTypeText(report.type)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}
                >
                  {getPriorityText(report.priority)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}
                >
                  {getStatusText(report.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(report.date_created)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Admin Details Modal Component
const AdminDetailsModal = ({
  item,
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
  onClose,
  isSubmitting,
}: {
  item: ProjectRequest | Project;
  comments: ProjectComment[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}) => {
  const isProject = 'project_id' in item;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isProject ? (item as Project).name : (item as ProjectRequest).title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isProject ? 'Información del Proyecto' : 'Información de la Solicitud'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">
                    {isProject ? (item as Project).project_id : (item as ProjectRequest).request_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business ID:</span>
                  <span className="font-medium">{item.business_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}
                  >
                    {getTypeText(item.type)}
                  </span>
                </div>
                {!isProject && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prioridad:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor((item as ProjectRequest).priority)}`}
                    >
                      {getPriorityText((item as ProjectRequest).priority)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado:</span>
                  <span className="text-gray-900">{formatDate(item.date_created)}</span>
                </div>
              </div>
            </div>

            {isProject && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Desarrollo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desarrollo:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor((item as Project).development_status)}`}
                    >
                      {getStatusText((item as Project).development_status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progreso:</span>
                    <span className="font-medium">{(item as Project).development_progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(item as Project).development_progress}%` }}
                    ></div>
                  </div>
                  {(item as Project).executions !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ejecuciones:</span>
                      <span className="font-medium text-green-600">
                        {(item as Project).executions}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
              {isProject ? 'Descripción del proyecto...' : (item as ProjectRequest).description}
            </p>
          </div>

          {/* Comments Section (only for projects) */}
          {isProject && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Comentarios ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => onNewCommentChange(e.target.value)}
                  placeholder="Agregar comentario como LetParley..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={onAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Comentar
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay comentarios aún</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.comment_id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              comment.user_type === 'letparley' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">
                            {comment.user_type === 'letparley' ? 'LetParley' : 'Cliente'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.date_created)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Convert Request Modal Component
const ConvertRequestModal = ({
  request,
  onConvert,
  onClose,
  isSubmitting,
}: {
  request: ProjectRequest;
  onConvert: (request: ProjectRequest, projectName: string) => void;
  onClose: () => void;
  isSubmitting: boolean;
}) => {
  const [projectName, setProjectName] = useState(
    `${request.title} - Business ${request.business_id}`,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert(request, projectName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Convertir a Proyecto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitud Original</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Título:</span> {request.title}
              </p>
              <p>
                <span className="font-medium">Tipo:</span> {getTypeText(request.type)}
              </p>
              <p>
                <span className="font-medium">Prioridad:</span> {getPriorityText(request.priority)}
              </p>
              <p>
                <span className="font-medium">Descripción:</span> {request.description}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Nombre descriptivo del proyecto"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !projectName.trim()}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Convirtiendo...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Convertir a Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectsAdminPage;
