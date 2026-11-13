export type CourseCategory =
  | 'General Education'
  | 'Mathematics'
  | 'Computer Science Core'
  | 'Electives'

export type SampleCourse = {
  id: string
  code: string
  title: string
  credits: number
  category: CourseCategory
}

export type SampleDegreePlan = {
  id: string
  name: string
  catalogLabel: string
  disclaimer: string
  courses: SampleCourse[]
}

export type CategoryProgress = {
  category: CourseCategory
  total: number
  completed: number
  remaining: number
  percent: number
}

export type ProgressSummary = {
  total: number
  completed: number
  remaining: number
  percent: number
  byCategory: CategoryProgress[]
}

/** Map of course id -> completed */
export type CompletionMap = Record<string, boolean>
