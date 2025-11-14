import { useState } from 'react';
import { Search, Video, FileText, Beaker, Presentation, Star, Download, Eye, Plus, X } from 'lucide-react';

interface ContentLibraryProps {
  isDarkMode: boolean;
}

const ContentLibrary = ({ isDarkMode }: ContentLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const resources = [
    {
      id: 1,
      title: 'Introduction to Quadratic Equations',
      type: 'video',
      subject: 'Mathematics',
      grade: 'Grade 9',
      rating: 4.8,
      duration: '12 min',
      tags: ['Algebra', 'Equations', 'Problem Solving'],
      thumbnail: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Newton\'s Laws of Motion - Practice Worksheet',
      type: 'worksheet',
      subject: 'Physics',
      grade: 'Grade 10',
      rating: 4.6,
      pages: 5,
      tags: ['Mechanics', 'Force', 'Motion'],
      thumbnail: 'https://images.pexels.com/photos/256301/pexels-photo-256301.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Chemical Reactions Interactive Simulation',
      type: 'simulation',
      subject: 'Chemistry',
      grade: 'Grade 9',
      rating: 4.9,
      tags: ['Reactions', 'Lab', 'Interactive'],
      thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      title: 'Cell Structure and Function - Slide Deck',
      type: 'slide',
      subject: 'Biology',
      grade: 'Grade 8',
      rating: 4.7,
      slides: 24,
      tags: ['Cell Biology', 'Organelles'],
      thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      title: 'Shakespeare\'s Literary Devices Video Series',
      type: 'video',
      subject: 'English',
      grade: 'Grade 10',
      rating: 4.8,
      duration: '18 min',
      tags: ['Literature', 'Poetry', 'Analysis'],
      thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      title: 'Photosynthesis Lab Activity Guide',
      type: 'worksheet',
      subject: 'Biology',
      grade: 'Grade 9',
      rating: 4.5,
      pages: 8,
      tags: ['Plants', 'Lab', 'Experiments'],
      thumbnail: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filterOptions = [
    { label: 'Video', value: 'video', icon: Video },
    { label: 'Worksheet', value: 'worksheet', icon: FileText },
    { label: 'Simulation', value: 'simulation', icon: Beaker },
    { label: 'Slides', value: 'slide', icon: Presentation }
  ];

  const toggleFilter = (value: string) => {
    setSelectedFilters(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(resource.type);
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'worksheet': return FileText;
      case 'simulation': return Beaker;
      case 'slide': return Presentation;
      default: return FileText;
    }
  };

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className="space-y-6">
      <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className={`w-full pl-12 pr-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedFilters.includes(filter.value);
              return (
                <button
                  key={filter.value}
                  onClick={() => toggleFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedFilters.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active filters:</span>
            {selectedFilters.map((filter) => (
              <span
                key={filter}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1"
              >
                {filter}
                <button onClick={() => toggleFilter(filter)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type);
          return (
            <div
              key={resource.id}
              className={`${cardClass} rounded-2xl border shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group`}
              onClick={() => setSelectedResource(resource)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <TypeIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-900 capitalize">{resource.type}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className={`font-semibold mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {resource.title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                    {resource.subject}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                    {resource.grade}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {resource.rating}
                    </span>
                  </div>
                  {resource.duration && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {resource.duration}
                    </span>
                  )}
                  {resource.pages && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {resource.pages} pages
                    </span>
                  )}
                  {resource.slides && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {resource.slides} slides
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add to Lesson
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedResource(null)}>
          <div
            className={`${cardClass} rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img
                src={selectedResource.thumbnail}
                alt={selectedResource.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>
            <div className="p-6">
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedResource.title}
              </h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                This is a preview of the selected resource. In a full implementation, this would show the complete resource content or player.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
                  View Full Resource
                </button>
                <button className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors`}>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
