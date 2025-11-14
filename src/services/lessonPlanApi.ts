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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class LessonPlanApiService {
  private async makeRequest(endpoint: string, data: LessonPlanRequest | SimpleLessonPlanRequest | PreviewLessonPlanRequest): Promise<LessonPlanResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Generate a dynamic lesson plan with flexible input parameters
   * Can save to database if IDs are provided
   */
  async generateDynamicLessonPlan(request: LessonPlanRequest): Promise<LessonPlanResponse> {
    return this.makeRequest('/api/lesson-plan/generate-dynamic', request);
  }

  /**
   * Generate a lesson plan preview without saving to database
   */
  async previewLessonPlan(request: PreviewLessonPlanRequest): Promise<LessonPlanResponse> {
    return this.makeRequest('/api/lesson-plan/preview', request);
  }

  /**
   * Generate lesson plan using simplified endpoint with required fields
   */
  async generateSimpleLessonPlan(request: SimpleLessonPlanRequest): Promise<LessonPlanResponse> {
    return this.makeRequest('/api/lesson-plan/generate-simple', request);
  }

  /**
   * Generate lesson plan using the new API endpoint
   */
  async generateLessonPlan(request: LessonPlanRequest): Promise<LessonPlan> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lesson-plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get all lesson plans for a teacher
   */
  async getLessonPlans(teacherId: string): Promise<LessonPlan[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lesson-plan/teacher/${teacherId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle nested response structure
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result)) {
        return result;
      } else {
        console.warn('Unexpected lesson plans response format:', result);
        return [];
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export const lessonPlanApi = new LessonPlanApiService();