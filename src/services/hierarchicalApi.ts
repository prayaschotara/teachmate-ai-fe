// Hierarchical API services for grades, subjects, and chapters

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

class HierarchicalApiService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
   * Get all grades
   */
  async getGrades(): Promise<Grade[]> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: GradeApiResponse[] }>('/api/grade');
      
      if (response.success && Array.isArray(response.data)) {
        // Map API response to frontend interface
        return response.data.map(grade => ({
          id: grade._id,
          name: grade.grade_name,
        }));
      } else {
        console.warn('Unexpected grades response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch grades:', error);
      throw error;
    }
  }

  /**
   * Get subjects by grade ID
   */
  async getSubjectsByGrade(gradeId: string): Promise<Subject[]> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: SubjectApiResponse[] }>(`/api/subject/grade/${gradeId}`);
      
      if (response.success && Array.isArray(response.data)) {
        // Map API response to frontend interface
        return response.data.map(subject => ({
          id: subject._id,
          name: subject.subject_name,
          gradeId: subject.grade_id._id,
        }));
      } else {
        console.warn('Unexpected subjects response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      throw error;
    }
  }

  /**
   * Get chapters by subject ID and grade ID
   */
  async getChaptersBySubjectAndGrade(subjectId: string, gradeId: string): Promise<Chapter[]> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: ChapterApiResponse[] }>(`/api/chapter/subject/${subjectId}/grade/${gradeId}`);
      
      if (response.success && Array.isArray(response.data)) {
        // Map API response to frontend interface
        return response.data.map(chapter => ({
          id: chapter._id,
          name: chapter.chapter_name,
          subjectId: chapter.subject_id,
          gradeId: chapter.grade_id,
          chapter_number: parseInt(chapter.chapter_number),
        }));
      } else {
        console.warn('Unexpected chapters response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      throw error;
    }
  }
}

export const hierarchicalApi = new HierarchicalApiService();