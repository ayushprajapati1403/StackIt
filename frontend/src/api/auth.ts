const API_URL = "http://localhost:3000"

export async function signup({ username, email, password }: { username: string; email: string; password: string }) {
	const response = await fetch(`${API_URL}/api/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Signup failed');
	}

	return response.json();
}

export async function login({ email, password }: { email: string; password: string }) {
	const response = await fetch(`${API_URL}/api/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Invalid credentials');
	}

	return response.json();
}

export async function logout() {
	const token = localStorage.getItem('token');
	const response = await fetch(`${API_URL}/api/auth/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token && { 'Authorization': token })
		},
	});
	
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || errorData.message || 'Logout failed');
	}
	
	return response.json();
} 