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
  class_id?: string; // Required class selection
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
  completed_at?: string;
  has_assessment?: boolean;
  assessment_id?: string;
  status?: string;
}

export interface RecommendedVideo {
  title: string;
  url: string;
  duration: string;
  topic: string;
  source: string;
  _id:string ;
}

export interface LessonPlan {
  _id: string ;
  teacher_id:  string ;
  subject_id:  string ;
  subject_name: string;
  grade_id:  string ;
  grade_name: string;
  chapter_id:  string ;
  chapter_name: string;
  chapter_number: number;
  class_id: string | { _id: string; class_name?: string };
  total_sessions: number;
  session_duration: number;
  session_details: SessionDetail[];
  chapter_wise_assessment: unknown[];
  recommended_videos: RecommendedVideo[];
  overall_objectives: string[];
  learning_outcomes: string[];
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Helper function to extract string from MongoDB ObjectId
export function getIdString(id: string | { $oid: string } | undefined): string {
  if (!id) return '';
  return typeof id === 'string' ? id : id.$oid;
}

// Helper function to extract date string from MongoDB date
export function getDateString(date: string | { $date: string } | undefined): string {
  if (!date) return '';
  return typeof date === 'string' ? date : date.$date;
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
  _id?:  string ;
  teacher_id?:  string ;
  subject_id?:  string ;
  subject_name?: string;
  grade_id?:  string ;
  grade_name?: string;
  chapter_id?: string ;
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
  createdAt?: string;
  updatedAt?: string;
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

export interface AssessmentConfig {
  opens_on: string;
  due_date: string;
  duration: number;
}

/**
 * Mark a session as complete
 */
export async function markSessionComplete(lessonPlanId: string, sessionNumber: number): Promise<{ success: boolean; message: string }> {
  return privateFetcher<{ success: boolean; message: string }>(`/api/lesson-plan/${lessonPlanId}/session/${sessionNumber}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({
      assessment_config: {
        class_id: "6916cf2bf1751850d0885bb3"
      }
    }),
  });
}

/**
 * Create assessment for a completed session
 */
export async function createSessionAssessment(
  lessonPlanId: string,
  sessionNumber: number,
  config: AssessmentConfig
): Promise<{ success: boolean; message: string; assessment_id?: string }> {
  return privateFetcher<{ success: boolean; message: string; assessment_id?: string }>(
    `/api/lesson-plan/${lessonPlanId}/session/${sessionNumber}/create-assessment`,
    {
      method: 'POST',
      body: JSON.stringify(config),
    }
  );
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
    mutationFn: ({ lessonPlanId, sessionNumber, config }: { lessonPlanId: string; sessionNumber: number; config: AssessmentConfig }) =>
      createSessionAssessment(lessonPlanId, sessionNumber, config),
  });
}