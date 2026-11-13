import { describe, expect, it } from 'vitest'
import { SAMPLE_DEGREE_PLAN } from '../data/sampleDegreePlan'
import {
  createEmptyCompletionMap,
  normalizeCompletionMap,
  percentOf,
  summarizeCategory,
  summarizeProgress,
  toggleCourseCompletion,
} from './progressCalculations'

const courses = SAMPLE_DEGREE_PLAN.courses

describe('progressCalculations', () => {
  it('starts with an empty completion map for every sample course', () => {
    const empty = createEmptyCompletionMap(courses)
    expect(Object.keys(empty)).toHaveLength(courses.length)
    expect(Object.values(empty).every((value) => value === false)).toBe(true)
  })

  it('toggles a course without mutating unrelated entries', () => {
    const empty = createEmptyCompletionMap(courses)
    const next = toggleCourseCompletion(empty, 'csci-120')
    expect(next['csci-120']).toBe(true)
    expect(next['csci-230']).toBe(false)
    expect(empty['csci-120']).toBe(false)
  })

  it('calculates overall and category progress correctly', () => {
    const completions = createEmptyCompletionMap(courses)
    completions['gen-eng-113'] = true
    completions['gen-eng-123'] = true
    completions['math-131'] = true
    completions['csci-120'] = true

    const summary = summarizeProgress(courses, completions)
    expect(summary.completed).toBe(4)
    expect(summary.remaining).toBe(courses.length - 4)
    expect(summary.percent).toBe(percentOf(4, courses.length))

    const genEd = summarizeCategory(courses, completions, 'General Education')
    expect(genEd.completed).toBe(2)
    expect(genEd.total).toBe(4)
    expect(genEd.percent).toBe(50)

    const math = summarizeCategory(courses, completions, 'Mathematics')
    expect(math.completed).toBe(1)
    expect(math.total).toBe(3)
  })

  it('ignores unknown stored course ids when normalizing', () => {
    const normalized = normalizeCompletionMap(courses, {
      'csci-120': true,
      'not-a-real-course': true,
    })
    expect(normalized['csci-120']).toBe(true)
    expect(normalized['not-a-real-course']).toBeUndefined()
  })
})
