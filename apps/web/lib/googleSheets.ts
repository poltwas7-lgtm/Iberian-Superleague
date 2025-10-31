import { google } from 'googleapis';

export function getSheetsClient() {
	// Google Sheets client
	const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
	const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

	if (!clientEmail || !privateKey) {
		throw new Error('Google Sheets credentials are missing');
	}

	const auth = new google.auth.JWT({
		email: clientEmail,
		key: privateKey,
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
	});

	const sheets = google.sheets({ version: 'v4', auth });
	return sheets;
}

export async function fetchSpreadsheetTitle(spreadsheetId: string) {
	const sheets = getSheetsClient();
	const resp = await sheets.spreadsheets.get({ spreadsheetId });
	return resp.data.properties?.title ?? 'unknown';
}
