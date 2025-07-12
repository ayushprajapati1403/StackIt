const API_URL = "http://localhost:3000";

export async function postComment({ answerId, content, token }: { answerId: string, content: string, token: string }) {
	const response = await fetch(`${API_URL}/api/comments`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		},
		body: JSON.stringify({ answerId, content })
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Failed to post comment');
	}
	return response.json();
}

export async function fetchComments({ answerId }: { answerId: string }) {
	const response = await fetch(`${API_URL}/api/answers/${answerId}/comments`);
	if (!response.ok) {
		throw new Error('Failed to fetch comments');
	}
	return response.json();
}

export async function deleteComment({ id, token }: { id: string, token: string }) {
	const response = await fetch(`${API_URL}/api/comments/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: token
		}
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Failed to delete comment');
	}
	return response.json();
} 