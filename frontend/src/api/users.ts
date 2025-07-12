const API_URL = "http://localhost:3000";

export async function fetchUserProfile(token: string) {
	const response = await fetch(`${API_URL}/api/users/me`, {
		headers: { Authorization: token }
	});
	if (!response.ok) throw new Error('Failed to fetch user profile');
	return response.json();
}

export async function fetchUserQuestions(token: string) {
	const response = await fetch(`${API_URL}/api/users/me/questions`, {
		headers: { Authorization: token }
	});
	if (!response.ok) throw new Error('Failed to fetch user questions');
	return response.json();
}

export async function fetchUserAnswers(token: string) {
	const response = await fetch(`${API_URL}/api/users/me/answers`, {
		headers: { Authorization: token }
	});
	if (!response.ok) throw new Error('Failed to fetch user answers');
	return response.json();
}

export async function fetchUserComments(token: string) {
	const response = await fetch(`${API_URL}/api/users/me/comments`, {
		headers: { Authorization: token }
	});
	if (!response.ok) throw new Error('Failed to fetch user comments');
	return response.json();
} 