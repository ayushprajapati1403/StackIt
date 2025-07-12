const API_URL = "http://localhost:3000";

export async function fetchTags() {
	const response = await fetch(`${API_URL}/api/tags`);
	if (!response.ok) {
		throw new Error('Failed to fetch tags');
	}
	return response.json();
} 