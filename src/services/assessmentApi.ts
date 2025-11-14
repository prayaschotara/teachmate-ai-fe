// Assessment API services

import { privateFetcher } from '../lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';

// Assessment interfaces
export interface Assessment {
  _id: { $oid: string };
  title: string;
  subject: string;
  grade: string;
  questions: number;
  duration: number; // in minutes
  status: 'Published' | 'Draft';
  createdAt: { $date: string };
  updatedAt: { $date: string };
  teacher_id: { $oid: string };
  subject_id?: { $oid: string };
  grade_id?: { $oid: string };
  chapter_id?: { $oid: string };
  opens_on?: string;
  due_date?: string;
  class_id?: { $oid: string };
}

export interface CreateAssessmentRequest {
  title: string;
  subject_id: string;
  grade_id: string;
  chapter_id?: string;
  questions: number;
  duration: number;
  opens_on?: string;
  due_date?: string;
  teacher_id: string;
  class_id?: string;
}

export interface AssessmentStats {
  total: number;
  published: number;
  drafts: number;
  thisMonth: number;
}

/**
 * Get all assessments for a teacher
 */
export async function getAssessments(teacherId: string): Promise<Assessment[]> {
  const result = await privateFetcher<{ success?: boolean; data?: Assessment[] } | Assessment[]>(
    `/api/assessment/teacher/${teacherId}`
  );

  // Handle nested response structure
  if (result && typeof result === 'object' && 'success' in result && result.success && Array.isArray(result.data)) {
    return result.data;
  } else if (Array.isArray(result)) {
    return result;
  } else {
    console.warn('Unexpected assessments response format:', result);
    return [];
  }
}

/**
 * Create a new assessment
 */
export async function createAssessment(request: CreateAssessmentRequest): Promise<Assessment> {
  return privateFetcher<Assessment>('/api/assessment/create', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Update an assessment
 */
export async function updateAssessment(assessmentId: string, updates: Partial<CreateAssessmentRequest>): Promise<Assessment> {
  return privateFetcher<Assessment>(`/api/assessment/${assessmentId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(assessmentId: string): Promise<{ success: boolean; message: string }> {
  return privateFetcher<{ success: boolean; message: string }>(`/api/assessment/${assessmentId}`, {
    method: 'DELETE',
  });
}

/**
 * Get assessment statistics for a teacher
 */
export async function getAssessmentStats(teacherId: string): Promise<AssessmentStats> {
  const assessments = await getAssessments(teacherId);
  
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    total: assessments.length,
    published: assessments.filter(a => a.status === 'Published').length,
    drafts: assessments.filter(a => a.status === 'Draft').length,
    thisMonth: assessments.filter(a => {
      const createdDate = new Date(a.createdAt.$date);
      return createdDate >= thisMonth;
    }).length,
  };
}

// React Query hooks
export function useAssessments(teacherId: string | null) {
  return useQuery({
    queryKey: ['assessments', teacherId],
    queryFn: () => getAssessments(teacherId!),
    enabled: !!teacherId,
  });
}

export function useAssessmentStats(teacherId: string | null) {
  return useQuery({
    queryKey: ['assessmentStats', teacherId],
    queryFn: () => getAssessmentStats(teacherId!),
    enabled: !!teacherId,
  });
}

export function useCreateAssessment() {
  return useMutation({
    mutationFn: (request: CreateAssessmentRequest) => createAssessment(request),
  });
}

export function useUpdateAssessment() {
  return useMutation({
    mutationFn: ({ assessmentId, updates }: { assessmentId: string; updates: Partial<CreateAssessmentRequest> }) => 
      updateAssessment(assessmentId, updates),
  });
}

export function useDeleteAssessment() {
  return useMutation({
    mutationFn: (assessmentId: string) => deleteAssessment(assessmentId),
  });
}