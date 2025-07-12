export interface Question {
  id: string;
  title: string;
  tags: string[];
  author: {
    username: string;
    avatar: string;
  };
  createdAt: string;
  answerCount: number;
  acceptedAnswerId?: string;
  votes: number;
}