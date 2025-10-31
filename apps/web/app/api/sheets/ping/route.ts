import { fetchSpreadsheetTitle } from '@/lib/googleSheets';

export async function GET() {
	try {
		const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
		if (!spreadsheetId) {
			return Response.json({ ok: false, error: 'Missing GOOGLE_SHEETS_SPREADSHEET_ID' }, { status: 400 });
		}
		const title = await fetchSpreadsheetTitle(spreadsheetId);
		return Response.json({ ok: true, spreadsheetId, title });
	} catch (err: any) {
		return Response.json({ ok: false, error: err?.message ?? 'Unknown error' }, { status: 500 });
	}
}
