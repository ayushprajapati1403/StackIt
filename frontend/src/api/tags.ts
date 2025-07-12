const API_URL = "http://localhost:3000";

export async function fetchTags() {
	const response = await fetch(`${API_URL}/api/tags`);
	if (!response.ok) {
		throw new Error('Failed to fetch tags');
	}
	return response.json();
}

export async function suggestTags({ title, description }: { title: string; description: string }) {
	const response = await fetch(`${API_URL}/api/tags/suggest`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ title, description })
	});
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Failed to suggest tags');
	}
	const data = await response.json();
	return data.tags || [];
} 