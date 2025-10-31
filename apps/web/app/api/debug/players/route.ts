import { getPlayers } from '@/lib/googleSheets';
import { getSheetsClient } from '@/lib/googleSheets';

export async function GET() {
	try {
		const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
		if (!spreadsheetId) {
			return Response.json({ error: 'Missing GOOGLE_SHEETS_SPREADSHEET_ID' }, { status: 400 });
		}

		// Primero, obtener lista de todas las pestañas
		const sheets = getSheetsClient();
		const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
		const sheetList = spreadsheet.data.sheets?.map(s => ({
			title: s.properties?.title,
			sheetId: s.properties?.sheetId
		})) || [];

		// Intentar leer la pestaña "players" exactamente
		let playersData: any[] = [];
		let rawData: any = null;
		let error: string | null = null;

		try {
			playersData = await getPlayers(spreadsheetId);
		} catch (e: any) {
			error = e?.message || 'Unknown error';
		}

		// Intentar leer datos en bruto para debug
		try {
			const rawResp = await sheets.spreadsheets.values.get({
				spreadsheetId,
				range: 'players!A:ZZ'
			});
			rawData = {
				rowsCount: rawResp.data.values?.length || 0,
				firstRow: rawResp.data.values?.[0] || [],
				secondRow: rawResp.data.values?.[1] || [],
				sampleRows: rawResp.data.values?.slice(0, 3) || []
			};
		} catch (e: any) {
			rawData = { error: e?.message || 'Could not read raw data' };
		}

		return Response.json({
			sheetList,
			playersCount: playersData.length,
			playersData: playersData.slice(0, 5), // Primeros 5 para no saturar
			rawData,
			error
		});
	} catch (err: any) {
		return Response.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
	}
}

