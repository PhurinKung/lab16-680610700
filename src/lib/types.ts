interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  status?: "Active" | "Inactive";
  enrolledCourses?: string[]; // รายชื่อวิชา เช่น ["CS101", "CS201"]
}
export type { Student };

interface Course {
  courseCode: string;
  courseTitle: string;
  instructors?: string[];
}
export type { Course };

interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledAt?: string; 
}
export type { Enrollment };

interface User {
  username: string;
  password: string;
  studentId?: string | null;
  role: "STUDENT" | "ADMIN";
  tokens?: string[];
}
export type { User };
