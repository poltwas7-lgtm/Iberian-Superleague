import { getClubs } from '@/lib/googleSheets';

export async function GET() {
	try {
		const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
		if (!spreadsheetId) {
			return Response.json({ error: 'Missing GOOGLE_SHEETS_SPREADSHEET_ID' }, { status: 400 });
		}
		const clubs = await getClubs(spreadsheetId);
		return Response.json({ clubs });
	} catch (err: any) {
		return Response.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
	}
}

