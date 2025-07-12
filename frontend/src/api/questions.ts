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

export async function postQuestion({ title, description, tags, token }: { title: string; description: string; tags: string[]; token: string }) {
	const response = await fetch(`${API_URL}/api/questions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		},
		body: JSON.stringify({ title, description, tags })
	});
	if (!response.ok) {
		throw new Error('Failed to post question');
	}
	return response.json();
} 