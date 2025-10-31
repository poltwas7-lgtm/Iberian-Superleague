import { getLeagues } from '@/lib/googleSheets';

export async function GET() {
	try {
		const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
		if (!spreadsheetId) {
			return Response.json({ error: 'Missing GOOGLE_SHEETS_SPREADSHEET_ID' }, { status: 400 });
		}
		const leagues = await getLeagues(spreadsheetId);
		return Response.json({ leagues });
	} catch (err: any) {
		return Response.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
	}
}

