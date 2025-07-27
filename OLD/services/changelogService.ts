const API_BASE_URL = 'https://api3.letparley.com';

// Types for Changelog
export interface ChangelogPost {
  changelog_id: number;
  title: string;
  content: string;
  date_created: string;
  date_updated: string;
  is_published: boolean;
  created_by_email: string;
  created_by_username: string;
  tags: string;
  tag_colors: string;
}

export interface ChangelogResponse {
  posts: ChangelogPost[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
    next_offset: number;
  };
}

export interface CreateChangelogRequest {
  title: string;
  content: string;
  tags: Array<{
    tag_name: string;
    tag_color: string;
  }>;
}

export interface UpdateChangelogRequest {
  title?: string;
  content?: string;
  tags?: Array<{
    tag_name: string;
    tag_color: string;
  }>;
}

// Types for Proposals
export interface ProposalCategory {
  category_id: number;
  category_name: string;
  category_description: string;
  category_color: string;
  date_created: string;
  is_active: boolean;
}

export interface Proposal {
  proposal_id: number;
  title: string;
  description: string;
  status: 'En Revisión' | 'Aceptada' | 'Rechazada' | 'En Desarrollo' | 'Completada';
  is_implemented: boolean;
  date_created: string;
  date_updated: string | null;
  date_implemented: string | null;
  admin_notes: string;
  contact_email: string;
  contact_phone: string;
  created_by_email: string;
  created_by_username: string;
  category_name: string;
  category_description: string;
  category_color: string;
  vote_count: number;
  comment_count: number;
  user_has_voted?: boolean;
}

export interface ProposalComment {
  comment_id: number;
  proposal_id: number;
  comment: string;
  date_created: string;
  date_updated: string | null;
  user_email: string;
  user_name: string;
}

export interface ProposalWithComments {
  proposal: Proposal;
  comments: ProposalComment[];
}

export interface CreateProposalRequest {
  category_id: number;
  title: string;
  description: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface CreateCommentRequest {
  comment: string;
}

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  requiresAuth: boolean = false,
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth header if required
  if (requiresAuth) {
    const { useAuthStore } = await import('../store/authStore');
    const { sessionToken, signOut } = useAuthStore.getState();

    if (!sessionToken) {
      throw new Error('Authentication required');
    }

    headers['Authorization'] = `Bearer ${sessionToken}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401 && requiresAuth) {
      const { useAuthStore } = await import('../store/authStore');
      useAuthStore.getState().signOut();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Handle no content responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Changelog API functions
export const changelogApi = {
  // Get changelog posts (public)
  getPosts: async (params?: { limit?: number; offset?: number }): Promise<ChangelogResponse> => {
    let endpoint = '/changelog';

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());

      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
    }

    return apiRequest<ChangelogResponse>(endpoint);
  },

  // Get specific changelog post (public)
  getPost: async (id: number): Promise<ChangelogPost> => {
    return apiRequest<ChangelogPost>(`/changelog/${id}`);
  },

  // Admin functions (require auth)
  createPost: async (
    data: CreateChangelogRequest,
  ): Promise<{ success: boolean; message: string; changelog_id: number }> => {
    return apiRequest<{ success: boolean; message: string; changelog_id: number }>(
      '/admin/changelog',
      'POST',
      data,
      true,
    );
  },

  updatePost: async (
    id: number,
    data: UpdateChangelogRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
      `/admin/changelog/${id}`,
      'PUT',
      data,
      true,
    );
  },

  deletePost: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
      `/admin/changelog/${id}`,
      'DELETE',
      undefined,
      true,
    );
  },
};

// Proposals API functions
export const proposalsApi = {
  // Get proposal categories (requires auth)
  getCategories: async (): Promise<ProposalCategory[]> => {
    return apiRequest<ProposalCategory[]>('/proposal_categories', 'GET', undefined, true);
  },

  // Create new proposal (requires auth)
  createProposal: async (data: CreateProposalRequest): Promise<Proposal> => {
    return apiRequest<Proposal>('/proposals', 'POST', data, true);
  },

  // Get all proposals (auth optional)
  getProposals: async (params?: { status?: string; category_id?: number }): Promise<Proposal[]> => {
    let endpoint = '/proposals';

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.category_id) queryParams.append('category_id', params.category_id.toString());

      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
    }

    return apiRequest<Proposal[]>(endpoint, 'GET', undefined, true);
  },

  // Get specific proposal with comments (auth optional)
  getProposal: async (id: number): Promise<ProposalWithComments> => {
    return apiRequest<ProposalWithComments>(`/proposals/${id}`, 'GET', undefined, true);
  },

  // Vote on proposal (requires auth)
  voteProposal: async (
    id: number,
  ): Promise<{ action: 'added' | 'removed'; new_vote_count: number }> => {
    return apiRequest<{ action: 'added' | 'removed'; new_vote_count: number }>(
      `/proposals/${id}/vote`,
      'POST',
      undefined,
      true,
    );
  },

  // Add comment to proposal (requires auth)
  addComment: async (id: number, data: CreateCommentRequest): Promise<ProposalComment> => {
    return apiRequest<ProposalComment>(`/proposals/${id}/comments`, 'POST', data, true);
  },
};

// Utility functions
export const parseChangelogTags = (
  tags: string,
  colors: string,
): Array<{ name: string; color: string }> => {
  if (!tags || !colors) return [];

  const tagArray = tags.split(',').map((tag) => tag.trim());
  const colorArray = colors.split(',').map((color) => color.trim());

  return tagArray.map((tag, index) => ({
    name: tag,
    color: colorArray[index] || '#6B7280',
  }));
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'En Revisión':
      return '#F59E0B'; // Yellow
    case 'Aceptada':
      return '#10B981'; // Green
    case 'Rechazada':
      return '#EF4444'; // Red
    case 'En Desarrollo':
      return '#3B82F6'; // Blue
    case 'Completada':
      return '#8B5CF6'; // Purple
    default:
      return '#6B7280'; // Gray
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Hoy';
  } else if (diffInDays === 1) {
    return 'Ayer';
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} días`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `Hace ${years} año${years > 1 ? 's' : ''}`;
  }
};

// Predefined tag colors for the admin interface
export const PREDEFINED_TAG_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Amarillo', value: '#F59E0B' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Gris', value: '#6B7280' },
];
