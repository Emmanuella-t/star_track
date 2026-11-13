import { COURSE_CATEGORIES } from '../data/sampleDegreePlan'
import type {
  CategoryProgress,
  CompletionMap,
  CourseCategory,
  ProgressSummary,
  SampleCourse,
} from '../types/progress'

export function createEmptyCompletionMap(courses: SampleCourse[]): CompletionMap {
  return Object.fromEntries(courses.map((course) => [course.id, false]))
}

export function normalizeCompletionMap(
  courses: SampleCourse[],
  stored: CompletionMap | null | undefined,
): CompletionMap {
  const base = createEmptyCompletionMap(courses)
  if (!stored) return base

  for (const course of courses) {
    if (typeof stored[course.id] === 'boolean') {
      base[course.id] = stored[course.id]
    }
  }
  return base
}

export function toggleCourseCompletion(
  completions: CompletionMap,
  courseId: string,
): CompletionMap {
  if (!(courseId in completions)) return completions
  return {
    ...completions,
    [courseId]: !completions[courseId],
  }
}

export function percentOf(completed: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((completed / total) * 100)
}

export function summarizeCategory(
  courses: SampleCourse[],
  completions: CompletionMap,
  category: CourseCategory,
): CategoryProgress {
  const inCategory = courses.filter((course) => course.category === category)
  const completed = inCategory.filter((course) => completions[course.id]).length
  const total = inCategory.length

  return {
    category,
    total,
    completed,
    remaining: total - completed,
    percent: percentOf(completed, total),
  }
}

export function summarizeProgress(
  courses: SampleCourse[],
  completions: CompletionMap,
): ProgressSummary {
  const total = courses.length
  const completed = courses.filter((course) => completions[course.id]).length

  return {
    total,
    completed,
    remaining: total - completed,
    percent: percentOf(completed, total),
    byCategory: COURSE_CATEGORIES.map((category) =>
      summarizeCategory(courses, completions, category),
    ),
  }
}

export function groupCoursesByCategory(
  courses: SampleCourse[],
): Record<CourseCategory, SampleCourse[]> {
  const groups = Object.fromEntries(
    COURSE_CATEGORIES.map((category) => [category, [] as SampleCourse[]]),
  ) as Record<CourseCategory, SampleCourse[]>

  for (const course of courses) {
    groups[course.category].push(course)
  }
  return groups
}
