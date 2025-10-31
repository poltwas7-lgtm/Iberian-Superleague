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

export async function readSheetData(spreadsheetId: string, sheetName: string) {
	const sheets = getSheetsClient();
	const resp = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: `${sheetName}!A:ZZ`
	});

	const rows = resp.data.values;
	if (!rows || rows.length === 0) {
		return [];
	}

	// Primera fila son los headers
	const headers = rows[0].map((h: string) => h.toLowerCase().trim());
	
	// Convertir filas a objetos
	const data = rows.slice(1)
		.filter(row => row.some(cell => cell && cell.toString().trim()))
		.map(row => {
			const obj: Record<string, any> = {};
			headers.forEach((header, index) => {
				const value = row[index];
				// Intentar convertir números y booleanos
				if (value === '' || value === undefined || value === null) {
					obj[header] = null;
				} else if (value === 'true' || value === 'TRUE') {
					obj[header] = true;
				} else if (value === 'false' || value === 'FALSE') {
					obj[header] = false;
				} else if (!isNaN(Number(value)) && value.toString().trim() !== '') {
					obj[header] = Number(value);
				} else {
					obj[header] = value.toString().trim();
				}
			});
			return obj;
		});

	return data;
}

export async function getLeagues(spreadsheetId: string) {
	return readSheetData(spreadsheetId, 'leagues');
}

export async function getClubs(spreadsheetId: string) {
	return readSheetData(spreadsheetId, 'clubs');
}

export async function getMatches(spreadsheetId: string) {
	return readSheetData(spreadsheetId, 'matches');
}

export async function getPlayers(spreadsheetId: string) {
	// Intentar primero "players" (minúsculas), luego variaciones comunes
	try {
		const data = await readSheetData(spreadsheetId, 'players');
		if (data.length > 0) return data;
	} catch {}

	// Probar "JUGADORES" (mayúsculas, nombre en español)
	try {
		const data = await readSheetData(spreadsheetId, 'JUGADORES');
		if (data.length > 0) return data;
	} catch {}

	// Probar "Jugadores" (capitalizada)
	try {
		const data = await readSheetData(spreadsheetId, 'Jugadores');
		if (data.length > 0) return data;
	} catch {}

	// Si todo falla, devolver vacío
	return [];
}

export async function getStandings(spreadsheetId: string) {
	return readSheetData(spreadsheetId, 'standings');
}
