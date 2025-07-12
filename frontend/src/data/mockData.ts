import { Question } from '../types/Question';

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to implement authentication in React with TypeScript?',
    tags: ['react', 'typescript', 'authentication'],
    author: {
      username: 'alexdev',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    createdAt: '2024-01-15T10:30:00Z',
    answerCount: 5,
    acceptedAnswerId: 'ans1',
    votes: 24
  },
  {
    id: '2',
    title: 'Best practices for state management in large React applications',
    tags: ['react', 'state-management', 'redux'],
    author: {
      username: 'sarahcode',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    createdAt: '2024-01-15T08:15:00Z',
    answerCount: 8,
    votes: 42
  },
  {
    id: '3',
    title: 'How to optimize performance in Node.js applications?',
    tags: ['nodejs', 'performance', 'optimization'],
    author: {
      username: 'mikejs',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    createdAt: '2024-01-15T06:45:00Z',
    answerCount: 3,
    votes: 18
  },
  {
    id: '4',
    title: 'Understanding closures in JavaScript with practical examples',
    tags: ['javascript', 'closures', 'concepts'],
    author: {
      username: 'emmaweb',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    createdAt: '2024-01-14T22:20:00Z',
    answerCount: 12,
    acceptedAnswerId: 'ans4',
    votes: 67
  },
  {
    id: '5',
    title: 'CSS Grid vs Flexbox: When to use each?',
    tags: ['css', 'grid', 'flexbox', 'layout'],
    author: {
      username: 'davidstyles',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    createdAt: '2024-01-14T18:30:00Z',
    answerCount: 7,
    votes: 31
  },
  {
    id: '6',
    title: 'How to handle async operations in React hooks?',
    tags: ['react', 'hooks', 'async'],
    author: {
      username: 'rachelreact',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    createdAt: '2024-01-14T15:10:00Z',
    answerCount: 4,
    votes: 29
  }
];

export const availableTags = [
  'react',
  'typescript',
  'javascript',
  'nodejs',
  'css',
  'authentication',
  'performance',
  'hooks',
  'state-management'
];