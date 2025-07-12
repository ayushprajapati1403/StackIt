const API_URL = "http://localhost:3000";

export async function fetchNotifications(token: string) {
	const response = await fetch(`${API_URL}/api/notifications`, {
		headers: { Authorization: token }
	});
	if (!response.ok) throw new Error('Failed to fetch notifications');
	return response.json();
}

export async function markNotificationsRead(token: string, notificationIds: string[]) {
	const response = await fetch(`${API_URL}/api/notifications/mark-read`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token
		},
		body: JSON.stringify({ notificationIds })
	});
	if (!response.ok) throw new Error('Failed to mark notifications as read');
	return response.json();
} 