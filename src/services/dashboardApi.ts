// Dashboard API services

import { privateFetcher } from '../lib/api';
import {  useQuery } from '@tanstack/react-query';

export interface DashboardStats {
  activeLessons: number;
  totalAssessments: number;
  pendingAssessments: number;
  averageStudentProgress: number;
  contentItems: number;
  weeklyProgress: {
    lessonPlansCreated: number;
    totalLessonPlansTarget: number;
    assessmentsGraded: number;
    totalAssessmentsToGrade: number;
    parentReportsSent: number;
    totalParentReports: number;
  };
}

export interface RecentActivity {
  _id: string;
  title: string;
  type: 'Assessment' | 'Lesson Plan' | 'Content' | 'Report';
  time: string;
  status: 'completed' | 'draft' | 'published' | 'pending';
  createdAt: string;
}

export interface UpcomingTask {
  _id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
}

/**
 * Get dashboard statistics for a teacher
 */
export async function getDashboardStats(teacherId: string): Promise<DashboardStats> {
  try {
    const response = await privateFetcher<{ success: boolean; data: DashboardStats }>(
      `/api/teacher/${teacherId}/dashboard/stats`
    );

    if (response.success && response.data) {
      return response.data;
    }

    // Fallback to calculating from individual APIs if dashboard endpoint doesn't exist
    const [lessonPlans, assessments] = await Promise.all([
      privateFetcher<any>(`/api/lesson-plan/teacher/${teacherId}`),
      privateFetcher<any>(`/api/assessment/teacher/${teacherId}`)
    ]);

    const lessonPlanData = Array.isArray(lessonPlans) ? lessonPlans : lessonPlans?.data || [];
    const assessmentData = Array.isArray(assessments) ? assessments : assessments?.data || [];

    return {
      activeLessons: lessonPlanData.filter((lp: any) => lp.status === 'Active').length,
      totalAssessments: assessmentData.length,
      pendingAssessments: assessmentData.filter((a: any) => a.status === 'Draft').length,
      averageStudentProgress: 85, // This would need to be calculated from submissions
      contentItems: lessonPlanData.length + assessmentData.length,
      weeklyProgress: {
        lessonPlansCreated: lessonPlanData.filter((lp: any) => {
          const createdDate = new Date(lp.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate >= weekAgo;
        }).length,
        totalLessonPlansTarget: 10,
        assessmentsGraded: assessmentData.filter((a: any) => a.status === 'Published').length,
        totalAssessmentsToGrade: assessmentData.length,
        parentReportsSent: 8, // This would need a separate API
        totalParentReports: 12
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values on error
    return {
      activeLessons: 0,
      totalAssessments: 0,
      pendingAssessments: 0,
      averageStudentProgress: 0,
      contentItems: 0,
      weeklyProgress: {
        lessonPlansCreated: 0,
        totalLessonPlansTarget: 10,
        assessmentsGraded: 0,
        totalAssessmentsToGrade: 0,
        parentReportsSent: 0,
        totalParentReports: 0
      }
    };
  }
}

/**
 * Get recent activities for a teacher
 */
export async function getRecentActivities(teacherId: string): Promise<RecentActivity[]> {
  try {
    const response = await privateFetcher<{ success: boolean; data: RecentActivity[] }>(
      `/api/teacher/${teacherId}/dashboard/activities`
    );

    if (response.success && response.data) {
      return response.data;
    }

    // Fallback to combining data from multiple sources
    const [lessonPlans, assessments] = await Promise.all([
      privateFetcher<any>(`/api/lesson-plan/teacher/${teacherId}`),
      privateFetcher<any>(`/api/assessment/teacher/${teacherId}`)
    ]);

    const lessonPlanData = Array.isArray(lessonPlans) ? lessonPlans : lessonPlans?.data || [];
    const assessmentData = Array.isArray(assessments) ? assessments : assessments?.data || [];

    const activities: RecentActivity[] = [];

    // Add recent lesson plans
    lessonPlanData.slice(0, 2).forEach((lp: any) => {
      activities.push({
        _id: lp._id,
        title: `${lp.subject_name} Lesson Plan - ${lp.chapter_name}`,
        type: 'Lesson Plan',
        time: getRelativeTime(lp.createdAt),
        status: lp.status?.toLowerCase() || 'draft',
        createdAt: lp.createdAt
      });
    });

    // Add recent assessments
    assessmentData.slice(0, 2).forEach((assessment: any) => {
      activities.push({
        _id: assessment._id,
        title: assessment.title || `Assessment ${assessment._id.slice(-6)}`,
        type: 'Assessment',
        time: getRelativeTime(assessment.createdAt),
        status: assessment.status?.toLowerCase() || 'draft',
        createdAt: assessment.createdAt
      });
    });

    // Sort by creation date
    return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
}

/**
 * Get upcoming tasks for a teacher
 */
export async function getUpcomingTasks(teacherId: string): Promise<UpcomingTask[]> {
  try {
    const response = await privateFetcher<{ success: boolean; data: UpcomingTask[] }>(
      `/api/teacher/${teacherId}/dashboard/tasks`
    );

    if (response.success && response.data) {
      return response.data;
    }

    // Fallback to generating tasks from assessments
    const assessments = await privateFetcher<any>(`/api/assessment/teacher/${teacherId}`);
    const assessmentData = Array.isArray(assessments) ? assessments : assessments?.data || [];

    const tasks: UpcomingTask[] = [];

    // Add pending assessments as tasks
    const pendingAssessments = assessmentData.filter((a: any) => a.status === 'Draft');
    if (pendingAssessments.length > 0) {
      tasks.push({
        _id: 'review-assessments',
        title: `Review ${pendingAssessments.length} pending assessments`,
        dueDate: 'Today',
        priority: 'high',
        type: 'Assessment Review'
      });
    }

    // Add generic tasks
    tasks.push(
      {
        _id: 'lesson-plan-tomorrow',
        title: 'Prepare lesson plan for tomorrow',
        dueDate: 'Tomorrow',
        priority: 'medium',
        type: 'Lesson Planning'
      },
      {
        _id: 'progress-reports',
        title: 'Update student progress reports',
        dueDate: 'This week',
        priority: 'low',
        type: 'Reporting'
      }
    );

    return tasks.slice(0, 3);
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    return [];
  }
}

// Helper function to get relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}

// React Query hooks
export function useDashboardStats(teacherId: string | null) {
  return useQuery({
    queryKey: ['dashboardStats', teacherId],
    queryFn: () => getDashboardStats(teacherId!),
    enabled: !!teacherId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useRecentActivities(teacherId: string | null) {
  return useQuery({
    queryKey: ['recentActivities', teacherId],
    queryFn: () => getRecentActivities(teacherId!),
    enabled: !!teacherId,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

export function useUpcomingTasks(teacherId: string | null) {
  return useQuery({
    queryKey: ['upcomingTasks', teacherId],
    queryFn: () => getUpcomingTasks(teacherId!),
    enabled: !!teacherId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}