const API_URL = "http://localhost:3000";

export async function fetchQuestions() {
	const response = await fetch(`${API_URL}/api/questions`);
	if (!response.ok) {
		throw new Error('Failed to fetch questions');
	}
	return response.json();
}

export async function fetchQuestionById(id: string) {
	const response = await fetch(`${API_URL}/api/questions/${id}`);
	if (!response.ok) {
		throw new Error('Failed to fetch question details');
	}
	return response.json();
} 