export interface MockUserPersona {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: 'STUDENT' | 'STAFF';
   currentClass?: string;
   roleTitle?: string;
}

export const MOCK_PERSONAS: Record<'student' | 'staff', MockUserPersona> = {
   student: {
      id: 'mock-student-id-001',
      firstName: 'Dev',
      lastName: 'Student',
      email: 'dev.student@rca.ac.rw',
      role: 'STUDENT',
      currentClass: 'Year 3 Software Engineering',
   },
   staff: {
      id: 'mock-staff-id-001',
      firstName: 'Dev',
      lastName: 'Instructor',
      email: 'dev.staff@rca.ac.rw',
      role: 'STAFF',
      roleTitle: 'Lead Instructor',
   },
};

export const isMockAuthEnabled = (): boolean => {
   return process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';
};
