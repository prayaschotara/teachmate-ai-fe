// Hierarchical API services for grades, subjects, and chapters

import { privateFetcher } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

// API Response interfaces (what the backend returns)
interface GradeApiResponse {
  _id: string;
  grade_name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubjectApiResponse {
  _id: string;
  subject_name: string;
  grade_id: {
    _id: string;
    grade_name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  grade_name: string;
  classes: Array<{
    class_id: {
      _id: string;
      class_name: string;
      class_strength: number;
      grade_id: string;
      grade_name: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    class_name: string;
    _id: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ChapterApiResponse {
  _id: string;
  chapter_name: string;
  chapter_number: string;
  subject_id: string;
  subject_name: string;
  grade_id: string;
  grade_name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Frontend interfaces (what our components expect)
export interface Grade {
  id: string;
  name: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  gradeId: string;
}

export interface Chapter {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  gradeId: string;
  chapter_number?: number;
}

/**
 * Get all grades
 */
export async function getGrades(): Promise<Grade[]> {
  const response = await privateFetcher<{ success: boolean; data: GradeApiResponse[] }>('/api/grade');

  if (response.success && Array.isArray(response.data)) {
    return response.data.map((grade) => ({
      id: grade._id,
      name: grade.grade_name,
    }));
  }
  return [];
}

/**
 * Get subjects by grade ID
 */
export async function getSubjectsByGrade(gradeId: string): Promise<Subject[]> {
  const response = await privateFetcher<{ success: boolean; data: SubjectApiResponse[] }>(
    `/api/subject/grade/${gradeId}`
  );

  if (response.success && Array.isArray(response.data)) {
    return response.data.map((subject) => ({
      id: subject._id,
      name: subject.subject_name,
      gradeId: subject.grade_id._id,
    }));
  }
  return [];
}

/**
 * Get chapters by subject ID and grade ID
 */
export async function getChaptersBySubjectAndGrade(subjectId: string, gradeId: string): Promise<Chapter[]> {
  const response = await privateFetcher<{ success: boolean; data: ChapterApiResponse[] }>(
    `/api/chapter/subject/${subjectId}/grade/${gradeId}`
  );

  if (response.success && Array.isArray(response.data)) {
    return response.data.map((chapter) => ({
      id: chapter._id,
      name: chapter.chapter_name,
      subjectId: chapter.subject_id,
      gradeId: chapter.grade_id,
      chapterNumber: parseInt(chapter.chapter_number),
    }));
  }
  return [];
}

// React Query hooks
export function useGrades() {
  return useQuery({
    queryKey: ['grades'],
    queryFn: getGrades,
  });
}

export function useSubjectsByGrade(gradeId: string | null) {
  return useQuery({
    queryKey: ['subjects', gradeId],
    queryFn: () => getSubjectsByGrade(gradeId!),
    enabled: !!gradeId,
  });
}

export function useChaptersBySubjectAndGrade(subjectId: string | null, gradeId: string | null) {
  return useQuery({
    queryKey: ['chapters', subjectId, gradeId],
    queryFn: () => getChaptersBySubjectAndGrade(subjectId!, gradeId!),
    enabled: !!subjectId && !!gradeId,
  });
}