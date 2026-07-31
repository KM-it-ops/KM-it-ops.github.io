export const identity = {
  name: 'Mahmoud Al Kurdi',
  degree: 'Bachelor of Science',
  field: 'Information Technologies',
  concentration: 'Cybersecurity',
  honors: 'Summa Cum Laude',
  school: 'Southern New Hampshire University',
  conferred: 'January 2026',
  gpa: 3.965,
  presidentsListTerms: 10,
  transferCredit: 'Central Piedmont Community College',
  verifyUrl: 'https://www.parchment.com/u/s/7SdL',
  resumeUrl: '/Michael_Kurdi_Resume_2026.pdf',
  githubUrl: 'https://github.com/KM-it-ops',
} as const

export const certification = {
  name: 'CompTIA Security+',
  exam: 'SY0-701',
  earned: 'January 2025',
  validThrough: 'January 2028',
  certNumber: 'COMP001022427231',
  verifyUrl: 'https://verify.comptia.org',
  verifyCode: 'FH5Y31S56EVQQKWD',
} as const

export interface CourseGroup {
  title: string
  accent: 'gold' | 'teal'
  courses: string[]
}

export const coursework: CourseGroup[] = [
  {
    title: 'Cyber Defense',
    accent: 'gold',
    courses: [
      'Cybersecurity Foundations',
      'Network Security',
      'Cyber Defense',
      'Computer Systems Security',
      'Legal & Human Factors of Cybersecurity',
      'Risk Management & Mitigation',
    ],
  },
  {
    title: 'Infrastructure',
    accent: 'teal',
    courses: [
      'Computer Networking',
      'Computer Operating Systems',
      'Cross-Platform Technologies',
      'Web-Oriented Services',
      'Computing as a Service',
      'IT Ops & Systems Planning',
    ],
  },
  {
    title: 'AI Practice',
    accent: 'gold',
    courses: ['Introduction to AI Literacy', 'Responsible AI', 'AI in Practice'],
  },
  {
    title: 'Foundations',
    accent: 'teal',
    courses: [
      'Introduction to Scripting',
      'Structured Database Environments',
      'Applied Statistics for STEM',
      'Project Management',
      'Systems Requirements & Implementation',
      'Digital Design Tools',
    ],
  },
] as const
