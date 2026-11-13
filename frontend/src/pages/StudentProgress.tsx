import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteHeader } from '../components/SiteHeader'
import { COURSE_CATEGORIES } from '../data/sampleDegreePlan'
import { useDegreeProgress } from '../hooks/useDegreeProgress'
import { groupCoursesByCategory } from '../lib/progressCalculations'
import './StudentProgress.css'

export function StudentProgress() {
  const { plan, courses, completions, summary, toggleCourse, resetProgress } =
    useDegreeProgress()
  const [confirmReset, setConfirmReset] = useState(false)
  const grouped = groupCoursesByCategory(courses)

  function handleResetConfirm() {
    resetProgress()
    setConfirmReset(false)
  }

  return (
    <div className="progress-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="app" />

      <main id="main-content" className="container progress-page__main">
        <header className="progress-page__header">
          <h1>{plan.name}</h1>
          <p className="progress-page__catalog">{plan.catalogLabel}</p>
          <p className="progress-page__disclaimer">{plan.disclaimer}</p>
          <Link className="progress-page__back" to="/student/dashboard">
            Back to dashboard
          </Link>
        </header>

        <section className="progress-summary" aria-labelledby="progress-summary-heading">
          <div className="progress-summary__copy">
            <h2 id="progress-summary-heading">Your Degree Progress</h2>
            <p>
              {summary.completed === 0
                ? 'Nothing marked yet. Check off the courses you have finished.'
                : `${summary.completed} of ${summary.total} courses completed`}
            </p>
          </div>

          <div className="progress-summary__meter">
            <div
              className="progress-ring"
              style={{ ['--progress' as string]: `${summary.percent}%` }}
              role="img"
              aria-label={`Overall progress ${summary.percent} percent`}
            >
              <span className="progress-ring__value">{summary.percent}%</span>
            </div>
            <dl className="progress-summary__stats">
              <div>
                <dt>Completed</dt>
                <dd>{summary.completed}</dd>
              </div>
              <div>
                <dt>Remaining</dt>
                <dd>{summary.remaining}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{summary.total}</dd>
              </div>
            </dl>
          </div>

          <ul className="progress-category-bars" aria-label="Progress by category">
            {summary.byCategory.map((category) => (
              <li key={category.category}>
                <div className="progress-category-bars__label">
                  <span>{category.category}</span>
                  <span>
                    {category.completed}/{category.total}
                  </span>
                </div>
                <div
                  className="progress-category-bars__track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={category.total}
                  aria-valuenow={category.completed}
                  aria-label={`${category.category}: ${category.completed} of ${category.total} complete`}
                >
                  <span style={{ width: `${category.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="progress-page__toolbar">
          {!confirmReset ? (
            <Button type="button" variant="ghost" onClick={() => setConfirmReset(true)}>
              Reset Progress
            </Button>
          ) : (
            <div className="progress-reset" role="group" aria-label="Confirm reset">
              <p>Clear all checked courses?</p>
              <Button type="button" variant="primary" onClick={handleResetConfirm}>
                Yes, reset
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="progress-groups">
          {COURSE_CATEGORIES.map((category) => {
            const categoryCourses = grouped[category]
            const categorySummary = summary.byCategory.find((item) => item.category === category)

            return (
              <section
                key={category}
                className="progress-group"
                aria-labelledby={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="progress-group__header">
                  <h2 id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}>
                    {category}
                  </h2>
                  <p>
                    {categorySummary
                      ? `${categorySummary.completed} of ${categorySummary.total} complete`
                      : null}
                  </p>
                </div>

                <ul className="progress-course-list">
                  {categoryCourses.map((course) => {
                    const checked = Boolean(completions[course.id])
                    const inputId = `course-${course.id}`

                    return (
                      <li key={course.id}>
                        <label className="progress-course" htmlFor={inputId}>
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCourse(course.id)}
                            aria-label={`${course.code} ${course.title}`}
                          />
                          <span className="progress-course__body">
                            <span className="progress-course__code">{course.code}</span>
                            <span className="progress-course__title">{course.title}</span>
                            <span className="progress-course__credits">
                              {course.credits} credits
                            </span>
                          </span>
                          <span className="progress-course__state" aria-hidden="true">
                            {checked ? 'Done' : 'To do'}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>

        <PrototypeNotice />
      </main>
    </div>
  )
}
