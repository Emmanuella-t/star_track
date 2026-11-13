import { useEffect, useMemo, useState } from 'react'
import { SAMPLE_DEGREE_PLAN } from '../data/sampleDegreePlan'
import {
  createEmptyCompletionMap,
  normalizeCompletionMap,
  summarizeProgress,
  toggleCourseCompletion,
} from '../lib/progressCalculations'
import {
  clearProgressStorage,
  readProgressFromStorage,
  writeProgressToStorage,
} from '../lib/progressStorage'
import type { CompletionMap } from '../types/progress'

export function useDegreeProgress() {
  const plan = SAMPLE_DEGREE_PLAN
  const courses = plan.courses

  const [completions, setCompletions] = useState<CompletionMap>(() =>
    normalizeCompletionMap(courses, readProgressFromStorage()),
  )

  useEffect(() => {
    writeProgressToStorage(completions)
  }, [completions])

  const summary = useMemo(
    () => summarizeProgress(courses, completions),
    [courses, completions],
  )

  function toggleCourse(courseId: string) {
    setCompletions((current) => toggleCourseCompletion(current, courseId))
  }

  function resetProgress() {
    const empty = createEmptyCompletionMap(courses)
    clearProgressStorage()
    setCompletions(empty)
  }

  return {
    plan,
    courses,
    completions,
    summary,
    toggleCourse,
    resetProgress,
  }
}
