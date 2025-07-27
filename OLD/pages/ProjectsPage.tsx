import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bug,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  FolderKanban,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react';
import {
  CreateCommentData,
  CreateProjectRequestData,
  CreateReportData,
  Project,
  ProjectComment,
  ProjectReport,
  ProjectRequest,
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

const ProjectsPage = () => {
  const { selectedBusinessId, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'projects' | 'requests'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectComments, setProjectComments] = useState<ProjectComment[]>([]);
  const [projectReports, setProjectReports] = useState<ProjectReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data when component mounts or when business changes
  useEffect(() => {
    if (isAuthenticated && selectedBusinessId) {
      console.log('Loading projects data for business:', selectedBusinessId);
      loadData();
    } else {
      console.log('Not loading projects data - missing auth or business:', {
        isAuthenticated,
        selectedBusinessId,
      });
    }
  }, [isAuthenticated, selectedBusinessId]);

  const loadData = async () => {
    if (!selectedBusinessId) {
      setError('No hay negocio seleccionado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching projects and requests for business:', selectedBusinessId);

      const [projectsResponse, requestsResponse] = await Promise.all([
        projectsApi.getProjects(),
        projectsApi.getProjectRequests(),
      ]);

      console.log('Projects API response:', projectsResponse);
      console.log('Requests API response:', requestsResponse);

      if (projectsResponse.success) {
        const projectsData = projectsResponse.data || [];
        console.log('Setting projects data:', projectsData);
        setProjects(projectsData);
      } else {
        console.error('Projects API returned success: false');
        setProjects([]);
      }

      if (requestsResponse.success) {
        const requestsData = requestsResponse.data || [];
        console.log('Setting requests data:', requestsData);
        setProjectRequests(requestsData);
      } else {
        console.error('Requests API returned success: false');
        setProjectRequests([]);
      }
    } catch (error) {
      console.error('Error loading projects data:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar datos');
      // Set empty arrays on error to prevent undefined state
      setProjects([]);
      setProjectRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    setIsLoading(true);

    try {
      const [commentsResponse, reportsResponse] = await Promise.all([
        projectsApi.getProjectComments(project.project_id),
        projectsApi.getProjectReports(project.project_id),
      ]);

      if (commentsResponse.success) {
        setProjectComments(commentsResponse.data || []);
      }

      if (reportsResponse.success) {
        setProjectReports(reportsResponse.data || []);
      }

      setShowProjectModal(true);
    } catch (error) {
      console.error('Error loading project details:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar detalles del proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (data: CreateProjectRequestData) => {
    setIsSubmitting(true);

    try {
      console.log('Creating project request:', data);
      const response = await projectsApi.createProjectRequest(data);
      console.log('Create request response:', response);

      if (response.success) {
        // Reload data to get the updated lists
        await loadData();
        setShowCreateRequestModal(false);
        setActiveTab('requests');
      }
    } catch (error) {
      console.error('Error creating project request:', error);
      setError(error instanceof Error ? error.message : 'Error al crear solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedProject || !newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await projectsApi.addProjectComment(selectedProject.project_id, {
        content: newComment.trim(),
      });

      if (response.success) {
        setProjectComments([...projectComments, response.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error instanceof Error ? error.message : 'Error al agregar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReport = async (data: CreateReportData) => {
    if (!selectedProject) return;

    setIsSubmitting(true);

    try {
      const response = await projectsApi.createProjectReport(selectedProject.project_id, data);

      if (response.success) {
        setProjectReports([...projectReports, response.data]);
        setShowReportModal(false);
      }
    } catch (error) {
      console.error('Error creating report:', error);
      setError(error instanceof Error ? error.message : 'Error al crear reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAutomation = async (project: Project) => {
    if (!project.can_control || project.development_status !== 'delivered') return;

    setIsSubmitting(true);

    try {
      await projectsApi.updateProjectStatus(project.project_id, {
        is_active: !project.is_active,
      });

      // Update local state
      setProjects(
        projects.map((p) =>
          p.project_id === project.project_id ? { ...p, is_active: !p.is_active } : p,
        ),
      );

      if (selectedProject?.project_id === project.project_id) {
        setSelectedProject({ ...selectedProject, is_active: !project.is_active });
      }
    } catch (error) {
      console.error('Error toggling automation:', error);
      setError(
        error instanceof Error ? error.message : 'Error al cambiar estado de automatización',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading or error states appropriately
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Autenticación Requerida</h3>
          <p className="text-gray-600">Debes iniciar sesión para ver los proyectos</p>
        </div>
      </div>
    );
  }

  if (!selectedBusinessId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Negocio No Seleccionado</h3>
          <p className="text-gray-600">Selecciona un negocio para ver los proyectos</p>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === '' || project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = projectRequests.filter((request) => {
    const matchesSearch =
      searchQuery === '' || request.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos y Automatizaciones</h1>
          <p className="text-gray-600">Gestiona tus proyectos de desarrollo y automatizaciones</p>
        </div>
        <button
          onClick={() => setShowCreateRequestModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Solicitud
        </button>
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FolderKanban className="h-4 w-4 inline mr-2" />
            Proyectos ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Solicitudes ({projectRequests.length})
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
              {activeTab === 'projects' ? (
                <>
                  <option value="active">Activo</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Completado</option>
                </>
              ) : (
                <>
                  <option value="pending">Pendiente</option>
                  <option value="under_review">En Revisión</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                  <option value="converted">Convertido</option>
                </>
              )}
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center justify-end">
            {activeTab === 'projects'
              ? `${filteredProjects.length} proyecto${filteredProjects.length !== 1 ? 's' : ''}`
              : `${filteredRequests.length} solicitud${filteredRequests.length !== 1 ? 'es' : ''}`}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'projects' ? (
        <ProjectsList
          projects={filteredProjects}
          onViewProject={loadProjectDetails}
          onToggleAutomation={handleToggleAutomation}
          isSubmitting={isSubmitting}
        />
      ) : (
        <RequestsList requests={filteredRequests} />
      )}

      {/* Create Request Modal */}
      {showCreateRequestModal && (
        <CreateRequestModal
          onClose={() => setShowCreateRequestModal(false)}
          onSubmit={handleCreateRequest}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Project Details Modal */}
      {showProjectModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          comments={projectComments}
          reports={projectReports}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          onAddComment={handleAddComment}
          onCreateReport={() => setShowReportModal(true)}
          onClose={() => {
            setShowProjectModal(false);
            setSelectedProject(null);
            setProjectComments([]);
            setProjectReports([]);
            setNewComment('');
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Create Report Modal */}
      {showReportModal && (
        <CreateReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleCreateReport}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

// Projects List Component
const ProjectsList = ({
  projects,
  onViewProject,
  onToggleAutomation,
  isSubmitting,
}: {
  projects: Project[];
  onViewProject: (project: Project) => void;
  onToggleAutomation: (project: Project) => void;
  isSubmitting: boolean;
}) => {
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
        <p className="text-gray-500">Crea tu primera solicitud para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.project_id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(project.type)}`}
                >
                  {getTypeText(project.type)}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                >
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estado de desarrollo:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.development_status)}`}
              >
                {getStatusText(project.development_status)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progreso:</span>
              <span className="font-medium">{project.development_progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.development_progress}%` }}
              ></div>
            </div>

            {project.type === 'automation' && project.development_status === 'delivered' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-medium ${project.is_active ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    {project.is_active ? 'Activo' : 'Pausado'}
                  </span>
                  {project.can_control && (
                    <button
                      onClick={() => onToggleAutomation(project)}
                      disabled={isSubmitting}
                      className={`p-1 rounded-full transition-colors ${
                        project.is_active
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-500 hover:bg-gray-100'
                      } disabled:opacity-50`}
                    >
                      {project.is_active ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {project.executions !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ejecuciones:</span>
                <span className="font-medium">{project.executions}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">{formatDate(project.date_created)}</span>
            <button
              onClick={() => onViewProject(project)}
              className="inline-flex items-center text-sm text-primary hover:text-primary-dark font-medium"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver detalles
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Requests List Component
const RequestsList = ({ requests }: { requests: ProjectRequest[] }) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
        <p className="text-gray-500">Crea tu primera solicitud para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solicitud
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Create Request Modal Component
const CreateRequestModal = ({
  onClose,
  onSubmit,
  isSubmitting,
}: {
  onClose: () => void;
  onSubmit: (data: CreateProjectRequestData) => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState<CreateProjectRequestData>({
    type: 'automation',
    title: '',
    description: '',
    priority: 'normal',
    budget_range: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Solicitud de Proyecto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Proyecto *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'development' | 'automation' })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            >
              <option value="automation">Automatización</option>
              <option value="development">Desarrollo Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Describe brevemente tu proyecto"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              placeholder="Explica detalladamente qué necesitas..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as 'normal' | 'urgent' })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Presupuesto
              </label>
              <input
                type="text"
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="$500-1000"
              />
            </div>
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
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Project Details Modal Component
const ProjectDetailsModal = ({
  project,
  comments,
  reports,
  newComment,
  onNewCommentChange,
  onAddComment,
  onCreateReport,
  onClose,
  isSubmitting,
}: {
  project: Project;
  comments: ProjectComment[];
  reports: ProjectReport[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  onCreateReport: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'reports'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="h-4 w-4 inline mr-2" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Comentarios ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bug className="h-4 w-4 inline mr-2" />
              Reportes ({reports.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Información del Proyecto
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(project.type)}`}
                      >
                        {getTypeText(project.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desarrollo:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.development_status)}`}
                      >
                        {getStatusText(project.development_status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progreso:</span>
                      <span className="font-medium">{project.development_progress}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creado:</span>
                      <span className="text-gray-900">{formatDate(project.date_created)}</span>
                    </div>
                    {project.executions !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ejecuciones:</span>
                        <span className="font-medium text-green-600">{project.executions}</span>
                      </div>
                    )}
                    {project.last_execution_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última ejecución:</span>
                        <span className="text-gray-900">
                          {formatDate(project.last_execution_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso de Desarrollo</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-300"
                    style={{ width: `${project.development_progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{project.development_progress}% completado</p>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Comentarios</h3>
              </div>

              {/* Add Comment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <textarea
                  value={newComment}
                  onChange={(e) => onNewCommentChange(e.target.value)}
                  placeholder="Agregar un comentario..."
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

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Reportes</h3>
                <button
                  onClick={onCreateReport}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Reportar Problema
                </button>
              </div>

              <div className="space-y-4">
                {reports.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay reportes</p>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.report_id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}
                            >
                              {getStatusText(report.status)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}
                            >
                              {getPriorityText(report.priority)}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(report.date_created)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{report.description}</p>
                      {report.response && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                          <p className="text-sm text-blue-700">{report.response}</p>
                          {report.resolved_at && (
                            <p className="text-xs text-blue-600 mt-1">
                              Resuelto el {formatDate(report.resolved_at)}
                            </p>
                          )}
                        </div>
                      )}
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

// Create Report Modal Component
const CreateReportModal = ({
  onClose,
  onSubmit,
  isSubmitting,
}: {
  onClose: () => void;
  onSubmit: (data: CreateReportData) => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState<CreateReportData>({
    type: 'bug',
    title: '',
    description: '',
    priority: 'normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reportar Problema</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reporte
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="bug">Error/Bug</option>
                <option value="improvement">Mejora</option>
                <option value="change">Cambio</option>
                <option value="question">Pregunta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as 'normal' | 'urgent' })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Describe brevemente el problema"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              placeholder="Explica detalladamente el problema..."
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
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4 mr-2" />
                  Enviar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectsPage;
