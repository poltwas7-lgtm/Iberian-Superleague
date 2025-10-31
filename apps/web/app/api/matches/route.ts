import { getMatches } from '@/lib/googleSheets';

export async function GET() {
	try {
		const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
		if (!spreadsheetId) {
			return Response.json({ error: 'Missing GOOGLE_SHEETS_SPREADSHEET_ID' }, { status: 400 });
		}
		const matches = await getMatches(spreadsheetId);
		return Response.json({ matches });
	} catch (err: any) {
		return Response.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
	}
}

