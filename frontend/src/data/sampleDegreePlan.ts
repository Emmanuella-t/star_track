import type { CourseCategory, SampleCourse, SampleDegreePlan } from '../types/progress'

export const COURSE_CATEGORIES: CourseCategory[] = [
  'General Education',
  'Mathematics',
  'Computer Science Core',
  'Electives',
]

/** Fixed example checklist for the class project. Display copy should not read as official audit data. */
export const SAMPLE_COURSES: SampleCourse[] = [
  {
    id: 'gen-eng-113',
    code: 'ENG 113',
    title: 'Composition I',
    credits: 3,
    category: 'General Education',
  },
  {
    id: 'gen-eng-123',
    code: 'ENG 123',
    title: 'Composition II',
    credits: 3,
    category: 'General Education',
  },
  {
    id: 'gen-hist-201',
    code: 'HIST 201',
    title: 'World History Survey',
    credits: 3,
    category: 'General Education',
  },
  {
    id: 'gen-soc-101',
    code: 'SOC 101',
    title: 'Introduction to Sociology',
    credits: 3,
    category: 'General Education',
  },
  {
    id: 'math-131',
    code: 'MATH 131',
    title: 'College Algebra',
    credits: 3,
    category: 'Mathematics',
  },
  {
    id: 'math-201',
    code: 'MATH 201',
    title: 'Calculus I',
    credits: 4,
    category: 'Mathematics',
  },
  {
    id: 'math-210',
    code: 'MATH 210',
    title: 'Discrete Mathematics',
    credits: 3,
    category: 'Mathematics',
  },
  {
    id: 'csci-120',
    code: 'CSCI 120',
    title: 'Introduction to Computer Science',
    credits: 3,
    category: 'Computer Science Core',
  },
  {
    id: 'csci-230',
    code: 'CSCI 230',
    title: 'Data Structures',
    credits: 3,
    category: 'Computer Science Core',
  },
  {
    id: 'csci-310',
    code: 'CSCI 310',
    title: 'Computer Organization',
    credits: 3,
    category: 'Computer Science Core',
  },
  {
    id: 'csci-350',
    code: 'CSCI 350',
    title: 'Database Systems',
    credits: 3,
    category: 'Computer Science Core',
  },
  {
    id: 'csci-420',
    code: 'CSCI 420',
    title: 'Software Engineering',
    credits: 3,
    category: 'Computer Science Core',
  },
  {
    id: 'csci-480',
    code: 'CSCI 480',
    title: 'Senior Capstone',
    credits: 3,
    category: 'Computer Science Core',
  },
  {
    id: 'elec-360',
    code: 'CSCI 360',
    title: 'Web Application Development',
    credits: 3,
    category: 'Electives',
  },
  {
    id: 'elec-370',
    code: 'CSCI 370',
    title: 'Introduction to Cybersecurity',
    credits: 3,
    category: 'Electives',
  },
  {
    id: 'elec-390',
    code: 'CSCI 390',
    title: 'Special Topics in Computing',
    credits: 3,
    category: 'Electives',
  },
]

export const SAMPLE_DEGREE_PLAN: SampleDegreePlan = {
  id: 'sample-cs-bs',
  name: 'Computer Science, B.S.',
  catalogLabel: 'Degree Requirements',
  disclaimer:
    'Progress is based on the courses you mark complete. Verify degree requirements with your academic advisor.',
  courses: SAMPLE_COURSES,
}
