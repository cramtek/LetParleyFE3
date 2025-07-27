import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

// Types for Project Requests
export interface ProjectRequest {
  request_id: number;
  business_id: number;
  user_id: string;
  type: 'development' | 'automation';
  title: string;
  description: string;
  priority: 'normal' | 'urgent';
  budget_range?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'converted';
  date_created: string;
  last_updated: string;
}

export interface CreateProjectRequestData {
  type: 'development' | 'automation';
  title: string;
  description: string;
  priority: 'normal' | 'urgent';
  budget_range?: string;
}

// Types for Projects
export interface Project {
  project_id: number;
  request_id?: number;
  business_id: number;
  name: string;
  type: 'development' | 'automation';
  status: 'draft' | 'in_progress' | 'active' | 'paused' | 'completed';
  development_status:
    | 'pending'
    | 'analysis'
    | 'development'
    | 'testing'
    | 'review'
    | 'ready'
    | 'delivered'
    | 'maintenance';
  development_progress: number;
  is_active: boolean;
  executions?: number;
  last_execution_date?: string;
  can_control: boolean;
  date_created: string;
  last_updated?: string;
}

export interface CreateProjectFromRequestData {
  name: string;
}

export interface UpdateProjectStatusData {
  development_status?:
    | 'pending'
    | 'analysis'
    | 'development'
    | 'testing'
    | 'review'
    | 'ready'
    | 'delivered'
    | 'maintenance';
  development_progress?: number;
  is_active?: boolean;
}

// Types for Comments
export interface ProjectComment {
  comment_id: number;
  project_id: number;
  user_id: string;
  user_type: 'client' | 'letparley';
  content: string;
  date_created: string;
}

export interface CreateCommentData {
  content: string;
}

// Types for Reports
export interface ProjectReport {
  report_id: number;
  project_id: number;
  type: 'bug' | 'improvement' | 'change' | 'question';
  title: string;
  description: string;
  priority: 'normal' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  response?: string;
  date_created: string;
  resolved_at?: string;
}

export interface CreateReportData {
  type: 'bug' | 'improvement' | 'change' | 'question';
  title: string;
  description: string;
  priority: 'normal' | 'urgent';
}

// Helper function for API requests
const projectsRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
): Promise<T> => {
  const { sessionToken, signOut } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Making ${method} request to ${API_BASE_URL}${endpoint}`, data ? { data } : {});

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
      signOut();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} - ${errorText}`);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`API response for ${endpoint}:`, result);

    return result;
  } catch (error) {
    console.error(`Projects API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Projects API functions
export const projectsApi = {
  // Project Requests
  createProjectRequest: (
    data: CreateProjectRequestData,
  ): Promise<{ success: boolean; data: ProjectRequest; message: string }> => {
    const { selectedBusinessId, userEmail } = useAuthStore.getState();

    if (!selectedBusinessId) {
      throw new Error('No business selected');
    }

    if (!userEmail) {
      throw new Error('User email not available');
    }

    const requestData = {
      ...data,
      business_id: parseInt(selectedBusinessId, 10),
      user_email: userEmail,
    };

    console.log('Creating project request with data:', requestData);

    return projectsRequest<{ success: boolean; data: ProjectRequest; message: string }>(
      '/lpmobile/project-requests',
      'POST',
      requestData,
    );
  },

  getProjectRequests: (): Promise<{ success: boolean; data: ProjectRequest[] }> => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      throw new Error('No business selected');
    }

    console.log('Fetching project requests for business:', selectedBusinessId);

    return projectsRequest<{ success: boolean; data: ProjectRequest[] }>(
      `/lpmobile/project-requests?business_id=${selectedBusinessId}`,
    );
  },

  // Projects
  getProjects: (): Promise<{ success: boolean; data: Project[] }> => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      throw new Error('No business selected');
    }

    console.log('Fetching projects for business:', selectedBusinessId);

    return projectsRequest<{ success: boolean; data: Project[] }>(
      `/lpmobile/projects?business_id=${selectedBusinessId}`,
    );
  },

  createProjectFromRequest: (
    requestId: number,
    data: CreateProjectFromRequestData,
  ): Promise<{ success: boolean; data: Project; message: string }> => {
    return projectsRequest<{ success: boolean; data: Project; message: string }>(
      `/lpmobile/projects/from-request?request_id=${requestId}`,
      'POST',
      data,
    );
  },

  updateProjectStatus: (
    projectId: number,
    data: UpdateProjectStatusData,
  ): Promise<{ success: boolean; message: string }> => {
    return projectsRequest<{ success: boolean; message: string }>(
      `/lpmobile/projects/status?project_id=${projectId}`,
      'PATCH',
      data,
    );
  },

  // Comments
  getProjectComments: (
    projectId: number,
  ): Promise<{ success: boolean; data: ProjectComment[] }> => {
    return projectsRequest<{ success: boolean; data: ProjectComment[] }>(
      `/lpmobile/projects/comments?project_id=${projectId}`,
    );
  },

  addProjectComment: (
    projectId: number,
    data: CreateCommentData,
  ): Promise<{ success: boolean; data: ProjectComment; message: string }> => {
    const { userEmail } = useAuthStore.getState();

    if (!userEmail) {
      throw new Error('User email not available');
    }

    const requestData = {
      ...data,
      user_email: userEmail,
    };

    return projectsRequest<{ success: boolean; data: ProjectComment; message: string }>(
      `/lpmobile/projects/comments?project_id=${projectId}`,
      'POST',
      requestData,
    );
  },

  // Reports
  getProjectReports: (projectId: number): Promise<{ success: boolean; data: ProjectReport[] }> => {
    return projectsRequest<{ success: boolean; data: ProjectReport[] }>(
      `/lpmobile/projects/reports?project_id=${projectId}`,
    );
  },

  createProjectReport: (
    projectId: number,
    data: CreateReportData,
  ): Promise<{ success: boolean; data: ProjectReport; message: string }> => {
    const { userEmail } = useAuthStore.getState();

    if (!userEmail) {
      throw new Error('User email not available');
    }

    const requestData = {
      ...data,
      user_email: userEmail,
    };

    return projectsRequest<{ success: boolean; data: ProjectReport; message: string }>(
      `/lpmobile/projects/reports?project_id=${projectId}`,
      'POST',
      requestData,
    );
  },
};

// Utility functions
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'under_review':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'converted':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'paused':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'completed':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'analysis':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'development':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'testing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'review':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'ready':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'delivered':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'maintenance':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'under_review':
      return 'En Revisión';
    case 'approved':
      return 'Aprobado';
    case 'rejected':
      return 'Rechazado';
    case 'converted':
      return 'Convertido';
    case 'draft':
      return 'Borrador';
    case 'in_progress':
      return 'En Progreso';
    case 'active':
      return 'Activo';
    case 'paused':
      return 'Pausado';
    case 'completed':
      return 'Completado';
    case 'analysis':
      return 'Análisis';
    case 'development':
      return 'Desarrollo';
    case 'testing':
      return 'Pruebas';
    case 'review':
      return 'Revisión';
    case 'ready':
      return 'Listo';
    case 'delivered':
      return 'Entregado';
    case 'maintenance':
      return 'Mantenimiento';
    case 'open':
      return 'Abierto';
    case 'resolved':
      return 'Resuelto';
    case 'closed':
      return 'Cerrado';
    default:
      return status;
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'normal':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityText = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'Urgente';
    case 'normal':
      return 'Normal';
    default:
      return priority;
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'development':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'automation':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTypeText = (type: string): string => {
  switch (type) {
    case 'development':
      return 'Desarrollo';
    case 'automation':
      return 'Automatización';
    default:
      return type;
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
