import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AlertCircle, Plus, Save, Trash2, X } from 'lucide-react';
import {
  ChangelogPost,
  CreateChangelogRequest,
  PREDEFINED_TAG_COLORS,
  UpdateChangelogRequest,
  parseChangelogTags,
} from '../../services/changelogService';

interface ChangelogEditorProps {
  post: ChangelogPost | null;
  onClose: () => void;
  onSave: (data: CreateChangelogRequest | UpdateChangelogRequest) => Promise<void>;
}

interface Tag {
  tag_name: string;
  tag_color: string;
}

const ChangelogEditor = ({ post, onClose, onSave }: ChangelogEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PREDEFINED_TAG_COLORS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Load post data if editing
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);

      // Parse tags from comma-separated strings
      const parsedTags = parseChangelogTags(post.tags, post.tag_colors);
      setTags(
        parsedTags.map((tag) => ({
          tag_name: tag.name,
          tag_color: tag.color,
        })),
      );
    }
  }, [post]);

  // Prevent clicks inside the editor from closing the parent modal
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (editorRef.current && editorRef.current.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    setTags([
      ...tags,
      {
        tag_name: newTagName.trim(),
        tag_color: newTagColor,
      },
    ]);

    setNewTagName('');
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!content.trim()) {
      setError('El contenido es obligatorio');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        title: title.trim(),
        content: content.trim(),
        tags,
      };

      await onSave(data);
    } catch (error) {
      console.error('Error saving changelog post:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar el post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'link',
    'image',
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()} // Stop propagation at the outermost level
    >
      <div
        ref={editorRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Also stop propagation here
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {post ? 'Editar Post del Changelog' : 'Crear Nuevo Post del Changelog'}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Prevent event from bubbling up
              handleSubmit(e);
            }}
            className="space-y-6"
            onClick={(e) => e.stopPropagation()} // Stop propagation for the form
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Título del post"
                required
                onClick={(e) => e.stopPropagation()} // Stop propagation
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>

              {/* Current Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: tag.tag_color }}
                  >
                    {tag.tag_name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop propagation
                        handleRemoveTag(index);
                      }}
                      className="ml-2 text-white hover:text-white/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {tags.length === 0 && (
                  <span className="text-sm text-gray-500">No hay etiquetas</span>
                )}
              </div>

              {/* Add New Tag */}
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nueva etiqueta"
                    onClick={(e) => e.stopPropagation()} // Stop propagation
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()} // Stop propagation
                  >
                    {PREDEFINED_TAG_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation
                    handleAddTag();
                  }}
                  disabled={!newTagName.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenido *</label>
              <div
                className="border border-gray-300 rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Escribe el contenido del post..."
                  className="h-64"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Usa el editor para dar formato al contenido. Puedes agregar enlaces, imágenes,
                listas y más.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation
                handleSubmit(e);
              }}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {post ? 'Actualizar Post' : 'Publicar Post'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogEditor;
