const API_URL = "http://localhost:3000";

export async function postAnswer({ questionId, content, token }: { questionId: string; content: string; token: string }) {
	const response = await fetch(`${API_URL}/api/answers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		},
		body: JSON.stringify({ questionId, content })
	});
	if (!response.ok) {
		throw new Error('Failed to post answer');
	}
	return response.json();
}

export async function fetchAnswersByQuestionId(questionId: string) {
	const response = await fetch(`${API_URL}/api/questions/${questionId}`);
	if (!response.ok) {
		throw new Error('Failed to fetch answers');
	}
	const data = await response.json();
	return data.answers || [];
}

export async function deleteAnswer({ id, token }: { id: string, token: string }) {
	const response = await fetch(`${API_URL}/api/answers/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: token
		}
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Failed to delete answer');
	}
	return response.json();
} 