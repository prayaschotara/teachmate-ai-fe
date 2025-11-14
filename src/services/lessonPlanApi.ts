// API service for lesson plan generation

export interface LessonPlanRequest {
  subject_name: string;
  grade_name: string;
  topic: string;
  sessions: number;
  session_duration?: number;
  chapter_number?: number;
  // Required for saving to database
  teacher_id: string;
  subject_id: string;
  grade_id: string;
  chapter_id: string;
}

export interface SimpleLessonPlanRequest {
  subject: string;      // Required
  grade: string;        // Required
  chapter: string;      // Required
  sessions: number;     // Required
  session_duration?: number;
  // Optional - for saving to database
  teacher_id?: string;
  subject_id?: string;
  grade_id?: string;
  chapter_id?: string;
}

export interface PreviewLessonPlanRequest {
  subject_name: string;
  grade_name: string;
  topic: string;
  sessions: number;
  session_duration?: number;
}

export interface TeachingFlow {
  time_slot: string;
  activity: string;
  description: string;
}

export interface VideoResource {
  title: string;
  url: string;
  duration: string;
  source: string;
  topic: string;
}

export interface SimulationResource {
  title: string;
  url: string;
  type: string;
  topic: string;
}

export interface SessionResources {
  videos?: VideoResource[];
  simulations?: SimulationResource[];
}

export interface SessionDetail {
  session_number: number;
  learning_objectives: string[];
  topics_covered: string[];
  teaching_flow: TeachingFlow[];
  resources: SessionResources | null;
  assessment: unknown[];
  is_completed?: boolean;
  completed_at?: string;
}

export interface RecommendedVideo {
  title: string;
  url: string;
  duration: string;
  topic: string;
  source: string;
  _id: { $oid: string };
}

export interface LessonPlan {
  _id: { $oid: string };
  teacher_id: { $oid: string };
  subject_id: { $oid: string };
  subject_name: string;
  grade_id: { $oid: string };
  grade_name: string;
  chapter_id: { $oid: string };
  chapter_name: string;
  chapter_number: number;
  total_sessions: number;
  session_duration: number;
  session_details: SessionDetail[];
  chapter_wise_assessment: unknown[];
  recommended_videos: RecommendedVideo[];
  overall_objectives: string[];
  learning_outcomes: string[];
  status: string;
  isActive: boolean;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

export interface LessonPlanResponse {
  success?: boolean;
  message?: string;
  data?: {
    session_details: SessionDetail[];
    overall_objectives: string[];
    prerequisites: string[];
    learning_outcomes: string[];
  };
  saved?: boolean;
  note?: string;
  // Direct lesson plan response
  _id?: { $oid: string };
  teacher_id?: { $oid: string };
  subject_id?: { $oid: string };
  subject_name?: string;
  grade_id?: { $oid: string };
  grade_name?: string;
  chapter_id?: { $oid: string };
  chapter_name?: string;
  chapter_number?: number;
  total_sessions?: number;
  session_duration?: number;
  session_details?: SessionDetail[];
  chapter_wise_assessment?: unknown[];
  recommended_videos?: RecommendedVideo[];
  overall_objectives?: string[];
  learning_outcomes?: string[];
  status?: string;
  isActive?: boolean;
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
  __v?: number;
}

import { privateFetcher } from '../lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * Generate a dynamic lesson plan with flexible input parameters
 * Can save to database if IDs are provided
 */
export async function generateDynamicLessonPlan(request: LessonPlanRequest): Promise<LessonPlanResponse> {
  return privateFetcher<LessonPlanResponse>('/api/lesson-plan/generate-dynamic', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Generate a lesson plan preview without saving to database
 */
export async function previewLessonPlan(request: PreviewLessonPlanRequest): Promise<LessonPlanResponse> {
  return privateFetcher<LessonPlanResponse>('/api/lesson-plan/preview', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Generate lesson plan using simplified endpoint with required fields
 */
export async function generateSimpleLessonPlan(request: SimpleLessonPlanRequest): Promise<LessonPlanResponse> {
  return privateFetcher<LessonPlanResponse>('/api/lesson-plan/generate-simple', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Generate lesson plan using the new API endpoint
 */
export async function generateLessonPlan(request: LessonPlanRequest): Promise<LessonPlan> {
  return privateFetcher<LessonPlan>('/api/lesson-plan/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get all lesson plans for a teacher
 */
export async function getLessonPlans(teacherId: string): Promise<LessonPlan[]> {
  const result = await privateFetcher<{ success?: boolean; data?: LessonPlan[] } | LessonPlan[]>(
    `/api/lesson-plan/teacher/${teacherId}`
  );

  // Handle nested response structure
  if (result && typeof result === 'object' && 'success' in result && result.success && Array.isArray(result.data)) {
    return result.data;
  } else if (Array.isArray(result)) {
    return result;
  } else {
    console.warn('Unexpected lesson plans response format:', result);
    return [];
  }
}

// React Query hooks
export function useGenerateDynamicLessonPlan() {
  return useMutation({
    mutationFn: (request: LessonPlanRequest) => generateDynamicLessonPlan(request),
  });
}

export function usePreviewLessonPlan() {
  return useMutation({
    mutationFn: (request: PreviewLessonPlanRequest) => previewLessonPlan(request),
  });
}

export function useGenerateSimpleLessonPlan() {
  return useMutation({
    mutationFn: (request: SimpleLessonPlanRequest) => generateSimpleLessonPlan(request),
  });
}

export function useGenerateLessonPlan() {
  return useMutation({
    mutationFn: (request: LessonPlanRequest) => generateLessonPlan(request),
  });
}

/**
 * Mark a session as complete
 */
export async function markSessionComplete(lessonPlanId: string, sessionNumber: number, classId: string): Promise<{ success: boolean; message: string }> {
  return privateFetcher<{ success: boolean; message: string }>(`/api/lesson-plan/${lessonPlanId}/session/${sessionNumber}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({
      assessment_config: {
        class_id:"6916cf2bf1751850d0885bb3"
      }
    }),
  });
}

/**
 * Create assessment for a completed session
 * Uses the trigger-assessment endpoint with session number
 */
export async function createSessionAssessment(lessonPlanId: string, sessionNumber: number): Promise<{ success: boolean; message: string; assessment_id?: string }> {
  return privateFetcher<{ success: boolean; message: string; assessment_id?: string }>(`/api/lesson-plan/${lessonPlanId}/trigger-assessment`, {
    method: 'POST',
    body: JSON.stringify({ sessionNumber }),
  });
}

export function useLessonPlans(teacherId: string | null) {
  return useQuery({
    queryKey: ['lessonPlans', teacherId],
    queryFn: () => getLessonPlans(teacherId!),
    enabled: !!teacherId,
  });
}

export function useMarkSessionComplete() {
  return useMutation({
    mutationFn: ({ lessonPlanId, sessionNumber }: { lessonPlanId: string; sessionNumber: number }) => 
      markSessionComplete(lessonPlanId, sessionNumber),
  });
}

export function useCreateSessionAssessment() {
  return useMutation({
    mutationFn: ({ lessonPlanId, sessionNumber }: { lessonPlanId: string; sessionNumber: number }) => 
      createSessionAssessment(lessonPlanId, sessionNumber),
  });
}