import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit,
  ExternalLink,
  Filter,
  MessageCircle,
  Plus,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';
import {
  ChangelogPost,
  CreateChangelogRequest,
  CreateProposalRequest,
  PREDEFINED_TAG_COLORS,
  Proposal,
  ProposalCategory,
  UpdateChangelogRequest,
  changelogApi,
  formatDate,
  formatRelativeDate,
  getStatusColor,
  parseChangelogTags,
  proposalsApi,
} from '../../services/changelogService';
import { useAuthStore } from '../../store/authStore';
import ChangelogEditor from './ChangelogEditor';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangelogModal = ({ isOpen, onClose }: ChangelogModalProps) => {
  const { userEmail } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'changelog' | 'suggestions'>('changelog');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Changelog state
  const [changelogPosts, setChangelogPosts] = useState<ChangelogPost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  // Proposals state
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [categories, setCategories] = useState<ProposalCategory[]>([]);
  const [expandedProposals, setExpandedProposals] = useState<Set<number>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');

  // Admin changelog state
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCreateChangelogForm, setShowCreateChangelogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<ChangelogPost | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check if user is admin
  const isAdmin = userEmail === 'cramtek@hotmail.com';

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if we're showing the editor
      if (showCreateChangelogForm || editingPost) {
        return;
      }

      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, showCreateChangelogForm, editingPost]);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Load data when tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'changelog') {
        loadChangelogPosts();
      } else {
        loadProposals();
        loadCategories();
      }
    }
  }, [isOpen, activeTab]);

  const loadChangelogPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await changelogApi.getPosts({ limit: 50 });
      setChangelogPosts(response?.posts || []);
    } catch (error) {
      console.error('Error loading changelog:', error);
      setError('Error al cargar el changelog');
      setChangelogPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProposals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;

      const proposalsData = await proposalsApi.getProposals(params);
      setProposals(proposalsData || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      setError('Error al cargar las sugerencias');
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await proposalsApi.getCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const handleVote = async (proposalId: number) => {
    try {
      const result = await proposalsApi.voteProposal(proposalId);

      setProposals((prev) =>
        (prev || []).map((proposal) =>
          proposal.proposal_id === proposalId
            ? {
                ...proposal,
                vote_count: result.new_vote_count,
                user_has_voted: result.action === 'added',
              }
            : proposal,
        ),
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleCreateChangelogPost = async (data: CreateChangelogRequest) => {
    try {
      await changelogApi.createPost(data);
      await loadChangelogPosts();
      setShowCreateChangelogForm(false);
    } catch (error) {
      console.error('Error creating changelog post:', error);
      setError('Error al crear el post del changelog');
    }
  };

  const handleUpdateChangelogPost = async (id: number, data: UpdateChangelogRequest) => {
    try {
      await changelogApi.updatePost(id, data);
      await loadChangelogPosts();
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating changelog post:', error);
      setError('Error al actualizar el post del changelog');
    }
  };

  const handleDeleteChangelogPost = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post del changelog?')) {
      return;
    }

    try {
      await changelogApi.deletePost(id);
      await loadChangelogPosts();
    } catch (error) {
      console.error('Error deleting changelog post:', error);
      setError('Error al eliminar el post del changelog');
    }
  };

  const togglePostExpansion = (postId: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleProposalExpansion = (proposalId: number) => {
    setExpandedProposals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(proposalId)) {
        newSet.delete(proposalId);
      } else {
        newSet.add(proposalId);
      }
      return newSet;
    });
  };

  // Filter functions with null safety
  const filteredChangelogPosts = (changelogPosts || []).filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (post?.title || '').toLowerCase().includes(query) ||
      (post?.content || '').toLowerCase().includes(query)
    );
  });

  const filteredProposals = (proposals || []).filter((proposal) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (proposal?.title || '').toLowerCase().includes(query) ||
      (proposal?.description || '').toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          {/* Top bar with search and close */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Novedades y Sugerencias</h2>
                <p className="text-sm text-gray-600">
                  Mantente al día con las últimas actualizaciones
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Buscar"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              {isAdmin && activeTab === 'changelog' && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Panel de administración"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cerrar"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {showSearch && (
            <div className="px-4 pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Buscar en ${activeTab === 'changelog' ? 'changelog' : 'sugerencias'}...`}
                />
              </div>
            </div>
          )}

          {/* Admin Panel */}
          {isAdmin && activeTab === 'changelog' && showAdminPanel && (
            <div className="px-4 pb-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Panel de Administración</span>
                </div>
                <button
                  onClick={() => setShowCreateChangelogForm(true)}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'changelog' ? (
            <ChangelogContent
              posts={filteredChangelogPosts}
              expandedPosts={expandedPosts}
              onToggleExpansion={togglePostExpansion}
              isLoading={isLoading}
              error={error}
              isAdmin={isAdmin}
              showAdminPanel={showAdminPanel}
              onEditPost={setEditingPost}
              onDeletePost={handleDeleteChangelogPost}
            />
          ) : (
            <SuggestionsContent
              proposals={filteredProposals}
              categories={categories}
              expandedProposals={expandedProposals}
              showCreateForm={showCreateForm}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              onToggleExpansion={toggleProposalExpansion}
              onVote={handleVote}
              onShowCreateForm={setShowCreateForm}
              onStatusFilterChange={setStatusFilter}
              onCategoryFilterChange={setCategoryFilter}
              onRefresh={loadProposals}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* Tabs at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('changelog')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'changelog'
                  ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Changelog
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'suggestions'
                  ? 'text-blue-600 bg-white border-t-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Sugerencias
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Changelog Modal */}
      {(showCreateChangelogForm || editingPost) && (
        <ChangelogEditor
          post={editingPost}
          onClose={() => {
            setShowCreateChangelogForm(false);
            setEditingPost(null);
          }}
          onSave={
            editingPost
              ? (data) => handleUpdateChangelogPost(editingPost.changelog_id, data)
              : handleCreateChangelogPost
          }
        />
      )}
    </div>
  );
};

// Changelog Content Component
const ChangelogContent = ({
  posts,
  expandedPosts,
  onToggleExpansion,
  isLoading,
  error,
  isAdmin,
  showAdminPanel,
  onEditPost,
  onDeletePost,
}: {
  posts: ChangelogPost[];
  expandedPosts: Set<number>;
  onToggleExpansion: (id: number) => void;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  showAdminPanel: boolean;
  onEditPost: (post: ChangelogPost) => void;
  onDeletePost: (id: number) => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando changelog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron posts en el changelog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {posts.map((post) => {
        if (!post) return null;

        const isExpanded = expandedPosts.has(post.changelog_id);
        const tags = parseChangelogTags(post.tags, post.tag_colors);
        const contentPreview = (post.content || '').replace(/<[^>]*>/g, '').substring(0, 200);
        const needsExpansion = (post.content || '').length > 200;

        return (
          <div
            key={post.changelog_id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            {/* Header with admin controls */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(post.date_created)}
                {post.date_updated && (
                  <span className="ml-2 text-xs text-gray-400">
                    (Actualizado: {formatDate(post.date_updated)})
                  </span>
                )}
              </div>

              {isAdmin && showAdminPanel && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditPost(post)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="Editar post"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeletePost(post.changelog_id)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {post.title || 'Sin título'}
            </h3>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              {isExpanded ? (
                <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
              ) : (
                <p className="text-gray-700">
                  {contentPreview}
                  {needsExpansion && '...'}
                </p>
              )}
            </div>

            {/* Read More Button */}
            {needsExpansion && (
              <button
                onClick={() => onToggleExpansion(post.changelog_id)}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Leer Menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Leer Más
                  </>
                )}
              </button>
            )}

            {/* Author info for admin */}
            {isAdmin && showAdminPanel && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                Creado por: {post.created_by_username} ({post.created_by_email})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Suggestions Content Component (unchanged from previous implementation)
const SuggestionsContent = ({
  proposals,
  categories,
  expandedProposals,
  showCreateForm,
  statusFilter,
  categoryFilter,
  onToggleExpansion,
  onVote,
  onShowCreateForm,
  onStatusFilterChange,
  onCategoryFilterChange,
  onRefresh,
  isLoading,
  error,
}: {
  proposals: Proposal[];
  categories: ProposalCategory[];
  expandedProposals: Set<number>;
  showCreateForm: boolean;
  statusFilter: string;
  categoryFilter: number | '';
  onToggleExpansion: (id: number) => void;
  onVote: (id: number) => void;
  onShowCreateForm: (show: boolean) => void;
  onStatusFilterChange: (status: string) => void;
  onCategoryFilterChange: (category: number | '') => void;
  onRefresh: () => void;
  isLoading: boolean;
  error: string | null;
}) => {
  if (showCreateForm) {
    return (
      <CreateProposalForm
        categories={categories || []}
        onClose={() => onShowCreateForm(false)}
        onSuccess={() => {
          onShowCreateForm(false);
          onRefresh();
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filters and Create Button */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Aceptada">Aceptada</option>
              <option value="En Desarrollo">En Desarrollo</option>
              <option value="Completada">Completada</option>
              <option value="Rechazada">Rechazada</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value ? Number(e.target.value) : '')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {(categories || []).map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sugerencia
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando sugerencias...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        ) : !proposals || proposals.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron sugerencias</p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {proposals.map((proposal) => {
              if (!proposal) return null;

              const isExpanded = expandedProposals.has(proposal.proposal_id);
              const statusColor = getStatusColor(proposal.status);

              return (
                <div
                  key={proposal.proposal_id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(proposal.date_created)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {proposal.title || 'Sin título'}
                  </h3>

                  {/* Category */}
                  <div className="mb-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: proposal.category_color || '#6B7280' }}
                    >
                      {proposal.category_name || 'Sin categoría'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{proposal.description || 'Sin descripción'}</p>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Vote Button */}
                      <button
                        onClick={() => onVote(proposal.proposal_id)}
                        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          proposal.user_has_voted
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{proposal.vote_count || 0}</span>
                      </button>

                      {/* Comments Button */}
                      <button
                        onClick={() => onToggleExpansion(proposal.proposal_id)}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{proposal.comment_count || 0}</span>
                      </button>
                    </div>

                    {/* Status */}
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: statusColor }}
                    >
                      {proposal.status || 'Sin estado'}
                    </span>
                  </div>

                  {/* Comments Section */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <ProposalComments proposalId={proposal.proposal_id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Create Proposal Form Component
const CreateProposalForm = ({
  categories,
  onClose,
  onSuccess,
}: {
  categories: ProposalCategory[];
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { userEmail } = useAuthStore();
  const [formData, setFormData] = useState<CreateProposalRequest>({
    category_id: 0,
    title: '',
    description: '',
    contact_email: userEmail || '',
    contact_phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.category_id) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await proposalsApi.createProposal(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating proposal:', error);
      setError('Error al crear la sugerencia. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nueva Sugerencia</h3>
          <p className="text-gray-600">Comparte tu idea para mejorar LetParley</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Selecciona una categoría</option>
              {(categories || []).map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe tu sugerencia en pocas palabras"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Explica detalladamente tu sugerencia, por qué sería útil y cómo podría implementarse"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contacto
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="tu@email.com"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Se usa tu email de cuenta actual</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+506 1234 5678"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Sugerencia
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Proposal Comments Component
const ProposalComments = ({ proposalId }: { proposalId: number }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [proposalId]);

  const loadComments = async () => {
    try {
      const data = await proposalsApi.getProposal(proposalId);
      setComments(data?.comments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await proposalsApi.addComment(proposalId, { comment: newComment });
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate anonymous client name
  const generateAnonymousName = (userEmail: string): string => {
    // Generate a simple hash from email to ensure consistency
    let hash = 0;
    for (let i = 0; i < userEmail.length; i++) {
      const char = userEmail.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Generate 4 random digits based on the hash
    const randomNumber = Math.abs(hash % 9000) + 1000; // Ensures 4 digits
    return `cliente${randomNumber}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Comentarios ({(comments || []).length})</h4>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Añade un comentario..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Comentar
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {!comments || comments.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            if (!comment) return null;

            // Generate anonymous name for the comment author
            const anonymousName = generateAnonymousName(
              comment.user_email || 'unknown@example.com',
            );

            return (
              <div key={comment.comment_id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm">{anonymousName}</span>
                  <span className="text-xs text-gray-500">
                    {formatRelativeDate(comment.date_created)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{comment.comment || ''}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChangelogModal;
