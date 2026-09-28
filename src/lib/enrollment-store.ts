import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
  // enrollments as initialEnrollments,
  enrollments,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  // enrollments: Enrollment[];
  /** Admin ลงทะเบียนวิชาให้นักศึกษาคนใดก็ได้ (ไม่ซ้ำกับที่มีอยู่แล้ว) */
  enroll: (studentIds: string[], courseId: string) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  drop: (studentId: string, courseId: string) => void;
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string) => void;
  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  removeCourse: (courseId: string) => void;
  addCourse: (course: Course) => void;
  addProf: (ProfName: string, courseId: string) => void;
  removeProf: (ProfName: string, courseId: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
    students: initialStudents,
    courses: initialCourses,
    // enrollments: initialEnrollments,
  
    enroll: (studentIds, courseId) =>
      set((state) => ({
        // enrollments: state.enrollments.some(
        //   (e) => e.studentId === studentId && e.courseId === courseId,
        // )
        //   ? state.enrollments
        //   : [...state.enrollments, { studentId, courseId }],
        students: state.students.map(
          (s) => studentIds.includes(s.studentId)
            ? {
              ...s,
              enrolledCourses: s.enrolledCourses
                ? s.enrolledCourses.includes(courseId)
                  ? s.enrolledCourses
                  : [... s.enrolledCourses, courseId]
                : [courseId]
            }
            : s
      )
      })),
  
    drop: (studentId, courseId) =>
      set((state) => ({
        // enrollments: state.enrollments.filter(
        //   (e) => !(e.studentId === studentId && e.courseId === courseId),
        // ),
        students: state.students.map(
          (s) => s.studentId === studentId
          ? {
            ...s,
            enrolledCourses: s.enrolledCourses
              ? s.enrolledCourses.filter((id) => id !== courseId)
              : []
          }
          : s
        )
      })),
  
    removeStudent: (studentId) =>
      set((state) => ({
        students: state.students.filter((s) => s.studentId !== studentId),
        // enrollments: state.enrollments.filter((e) => e.studentId !== studentId),
      })),
  
    removeCourse: (courseId) =>
      set((state) => ({
        courses: state.courses.filter((c) => c.courseCode !== courseId),
        // enrollments: state.enrollments.filter((e) => e.courseId !== courseId),
      })),

    addCourse: (course) =>
      set((state) => ({
        courses: [...state.courses, course],
    })),
        
    addProf: (ProfName, courseId) =>
      set((state) => ({
        courses: state.courses.map(
          (c) => c.courseCode === courseId
          ? {
            ...c,
            instructors: c.instructors
            ? c.instructors.includes(ProfName)
              ? c.instructors
              : [... c.instructors, ProfName]
            : [ProfName]
          }
          : c
        )
      })),
    
    removeProf: (ProfName, courseId) =>
      set((state) => ({
        courses: state.courses.map(
          (c) => c.courseCode === courseId
            ? {
                ...c,
                instructors: c.instructors
                  ? c.instructors.filter((n) => n !== ProfName)
                  : [],
              }
            : c,
        ),
      })),
  }),
  {
    name: "lab16-2569-680610700",
    partialize: (state) => ({
      students: state.students,
      courses: state.courses,
    })
  }
  )
);
