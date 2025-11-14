// API service for lesson plan generation

export interface LessonPlanRequest {
  subject_name: string;
  grade_name: string;
  topic: string;
  sessions: number;
  session_duration?: number;
  // Optional - for saving to database
  teacher_id?: string;
  subject_id?: string;
  grade_id?: string;
  chapter_id?: string;
  chapter_number?: number;
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

export interface TeachingFlow {
  time_slot: string;
  activity: string;
  description: string;
}

export interface SessionDetail {
  session_number: number;
  learning_objectives: string[];
  topics_covered: string[];
  teaching_flow: TeachingFlow[];
}

export interface LessonPlanResponse {
  success: boolean;
  message: string;
  data: {
    session_details: SessionDetail[];
    overall_objectives: string[];
    prerequisites: string[];
    learning_outcomes: string[];
  };
  saved?: boolean;
  note?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class LessonPlanApiService {
  private async makeRequest(endpoint: string, data: LessonPlanRequest | SimpleLessonPlanRequest): Promise<LessonPlanResponse> {
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
  async previewLessonPlan(request: Omit<LessonPlanRequest, 'teacher_id' | 'subject_id' | 'grade_id' | 'chapter_id' | 'chapter_number'>): Promise<LessonPlanResponse> {
    return this.makeRequest('/api/lesson-plan/preview', request);
  }

  /**
   * Generate lesson plan using simplified endpoint with required fields
   */
  async generateSimpleLessonPlan(request: SimpleLessonPlanRequest): Promise<LessonPlanResponse> {
    return this.makeRequest('/api/lesson-plan/generate-simple', request);
  }

  /**
   * Original generate lesson plan endpoint requiring all database IDs
   */
  async generateLessonPlan(request: LessonPlanRequest & Required<Pick<LessonPlanRequest, 'teacher_id' | 'subject_id' | 'grade_id' | 'chapter_id' | 'chapter_number'>>): Promise<LessonPlanResponse> {
    return this.makeRequest('/api/lesson-plan/generate', request);
  }
}

export const lessonPlanApi = new LessonPlanApiService();