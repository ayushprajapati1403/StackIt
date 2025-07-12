const API_URL = "http://localhost:3000";

export async function postVote({ answerId, value, token }: { answerId: string; value: 1 | -1; token: string }) {
	const response = await fetch(`${API_URL}/api/votes`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		},
		body: JSON.stringify({ answerId, value })
	});
	if (!response.ok) {
		throw new Error('Failed to vote');
	}
	return response.json();
} 