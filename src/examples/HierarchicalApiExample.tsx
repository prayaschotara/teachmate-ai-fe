// Example component showing how to use the hierarchical API with React Query

import { useState } from 'react';
import { useGrades, useSubjectsByGrade, useChaptersBySubjectAndGrade } from '../services/hierarchicalApi';

export function HierarchicalApiExample() {
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Fetch grades - automatically cached by React Query
  const { data: grades, isLoading: isLoadingGrades, error: gradesError } = useGrades();

  // Fetch subjects - only when grade is selected
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjectsByGrade(selectedGradeId);

  // Fetch chapters - only when both grade and subject are selected
  const { data: chapters, isLoading: isLoadingChapters } = useChaptersBySubjectAndGrade(
    selectedSubjectId,
    selectedGradeId
  );

  if (gradesError) {
    return <div>Error loading grades: {gradesError.message}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Grades Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-2">Grade</label>
        <select
          value={selectedGradeId || ''}
          onChange={(e) => {
            setSelectedGradeId(e.target.value || null);
            setSelectedSubjectId(null); // Reset subject when grade changes
          }}
          disabled={isLoadingGrades}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select a grade...</option>
          {grades?.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subjects Dropdown */}
      {selectedGradeId && (
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => setSelectedSubjectId(e.target.value || null)}
            disabled={isLoadingSubjects}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select a subject...</option>
            {subjects?.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chapters List */}
      {selectedSubjectId && selectedGradeId && (
        <div>
          <label className="block text-sm font-medium mb-2">Chapters</label>
          {isLoadingChapters ? (
            <div>Loading chapters...</div>
          ) : (
            <ul className="space-y-2">
              {chapters?.map((chapter) => (
                <li key={chapter.id} className="p-2 border rounded">
                  {chapter.chapterNumber}. {chapter.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
