import { describe, expect, it } from 'vitest';
import { seedCourses } from './seed.js';

describe('Learning Academy curriculum', () => {
  const courses = seedCourses();

  it('gives every published course a complete, named curriculum', () => {
    expect(courses.length).toBeGreaterThan(0);
    for (const course of courses) {
      const lessons = course.sections.flatMap(section => section.lessons);
      expect(course.sections.length, `${course.title}: module count`).toBeGreaterThanOrEqual(3);
      expect(lessons.length, `${course.title}: lesson count`).toBeGreaterThanOrEqual(7);
      expect(course.sections.every(section => section.title.trim().length > 0), `${course.title}: module titles`).toBe(true);
      expect(lessons.every(lesson => lesson.title.trim().length > 0), `${course.title}: lesson titles`).toBe(true);
    }
  });

  it('contains no placeholder topic names or duplicate curriculum IDs', () => {
    const placeholders = /^(overview|core concepts|worked example|process walkthrough|common mistakes)$/i;
    for (const course of courses) {
      const sectionIds = course.sections.map(section => section.id);
      const lessons = course.sections.flatMap(section => section.lessons);
      const lessonIds = lessons.map(lesson => lesson.id);
      expect(new Set(sectionIds).size, `${course.title}: duplicate module IDs`).toBe(sectionIds.length);
      expect(new Set(lessonIds).size, `${course.title}: duplicate lesson IDs`).toBe(lessonIds.length);
      expect(lessons.some(lesson => placeholders.test(lesson.title)), `${course.title}: placeholder lesson`).toBe(false);
    }
  });
});
