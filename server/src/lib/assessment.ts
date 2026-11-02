import type { AssessmentQuestion, Course } from '../types.js';
import type { Store } from '../store.js';
import { instructionalLessons } from './progress.js';

export const PASSING_SCORE = 70;

const choices = (correct: string, alternatives: string[]) => {
  const values = [correct, ...alternatives.filter(x => x !== correct)];
  return [...new Set(values)].slice(0, 4);
};

/** Builds a deterministic course-specific knowledge check from the published course curriculum. */
export const assessmentQuestions = (course: Course, courses: Course[]): AssessmentQuestion[] => {
  const lessons = instructionalLessons(course);
  const otherAcademies = courses.map(c => c.academy).filter(x => x !== course.academy);
  const otherCategories = courses.map(c => c.category).filter(x => x !== course.category);
  const otherSkills = courses.flatMap(c => c.skills).filter(x => !course.skills.includes(x));
  const academyOptions = choices(course.academy, otherAcademies);
  const categoryOptions = choices(course.category, otherCategories);
  const skill = course.skills[0] ?? course.category;
  const skillOptions = choices(skill, otherSkills);
  const lesson = lessons[Math.min(1, Math.max(0, lessons.length - 1))]?.title ?? course.title;
  const lessonOptions = choices(lesson, courses.flatMap(c => instructionalLessons(c).map(l => l.title)).filter(x => x !== lesson));
  return [
    { id: `${course.id}-q1`, prompt: `Which academy delivers ${course.title}?`, options: academyOptions, correctIndex: academyOptions.indexOf(course.academy) },
    { id: `${course.id}-q2`, prompt: 'Which subject area is central to this program?', options: categoryOptions, correctIndex: categoryOptions.indexOf(course.category) },
    { id: `${course.id}-q3`, prompt: 'Which capability is explicitly developed in this course?', options: skillOptions, correctIndex: skillOptions.indexOf(skill) },
    { id: `${course.id}-q4`, prompt: 'Which topic appears in this course curriculum?', options: lessonOptions, correctIndex: lessonOptions.indexOf(lesson) },
    { id: `${course.id}-q5`, prompt: 'What is required to earn expert recognition and the certificate?', options: ['Complete the learning series and pass the assessment', 'Open the course once', 'Save the course for later', 'Watch only the first lesson'], correctIndex: 0 }
  ];
};

export const assessmentEligibility = (store: Store, userId: string, course: Course) => {
  const required = instructionalLessons(course);
  const productVideos = required.filter(lesson => lesson.type === 'video');
  const tutorialLessons = required.filter(lesson => lesson.type !== 'video');
  const completed = new Set(store.lessonProgress.filter(p => p.userId === userId && p.courseId === course.id && p.status === 'COMPLETED').map(p => p.lessonId));
  const videosComplete = productVideos.every(lesson => completed.has(lesson.id));
  const tutorialsComplete = tutorialLessons.every(lesson => completed.has(lesson.id));
  return required.length > 0 && videosComplete && tutorialsComplete;
};
