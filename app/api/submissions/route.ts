import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readableAnswers } from '@/lib/answers';

const HEADERS = [
  'Timestamp',
  'Source',
  'Name',
  'Phone',
  'Concern',
  'URL',
  'TeleCRM',
];


type SubmissionBody = {
  source: string;
  name: string;
  phone: string;
  concern: string;
  pageUrl: string;
  email: string;
  age: string;
  gender: string;
  answers: unknown;
  medicalDetail: string;
  score: number | null;
  band: string;
};

type TelecrmResponse = Record<string, unknown> & {
  synced?: boolean;
  statusCode?: number;
  leadId?: unknown;
  note?: string;
};

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSubmission(body: Record<string, unknown>): SubmissionBody {
  return {
    source: toText(body.source) || 'Consultation Modal',
    name: toText(body.name),
    phone: toText(body.phone),
    concern: toText(body.concern),
    pageUrl: toText(body.pageUrl),
    email: toText(body.email),
    age: toText(body.age),
    gender: toText(body.gender),
    answers: body.answers && typeof body.answers === 'object' ? body.answers : null,
    medicalDetail: toText(body.medicalDetail),
    score: typeof body.score === 'number' && Number.isFinite(body.score) ? Math.round(body.score) : null,
    band: toText(body.band),
  };
}

function getSheetWebhookUrl() {
  return (
    process.env.GOOGLE_APPS_SCRIPT_URL ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.NEXT_PUBLIC_GAS_URL ||
    process.env.YOUR_GOOGLE_SHEET_ID ||
    ''
  ).trim();
}

async function pushToSheet(body: SubmissionBody, timestamp: string, telecrmStatus: string) {
  const url = getSheetWebhookUrl();
  if (!url) return null;

  const row = [
    timestamp,
    body.source,
    body.name,
    body.phone,
    body.concern,
    body.pageUrl,
    telecrmStatus,
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      timestamp,
      source: body.source,
      name: body.name,
      phone: body.phone,
      concern: body.concern,
      pageUrl: body.pageUrl,
      url: body.pageUrl,
      telecrm: telecrmStatus,
      headers: HEADERS,
      row,
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Google Apps Script failed with ${res.status}: ${text}`);
  return text;
}

function normalizePhoneForTeleCRM(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function isTelecrmConfirmed(data: unknown) {
  if (!data || typeof data !== 'object') return false;

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.modifiedLeadIds) && record.modifiedLeadIds.length > 0) return true;
  if (Array.isArray(record.leadIds) && record.leadIds.length > 0) return true;
  if (record.leadId || record.id || record.LeadID) return true;

  // nested data object (e.g. { success: true, data: { leadId: "..." } })
  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>;
    if (nested.leadId || nested.id || nested.LeadID) return true;
  }

  // boolean success flag
  if (record.success === true) return true;

  if (String(record.result || '').toLowerCase() === 'accepted') return true;

  const status = String(record.status || '').toLowerCase();
  return status === 'created' || status === 'updated' || status === 'success' || status === '200';
}

async function pushToTeleCRM(body: SubmissionBody): Promise<TelecrmResponse | null> {
  const url = process.env.TELECRM_API_URL;
  const key = process.env.TELECRM_API_KEY;
  if (!url || !key) return null;

  const phone = normalizePhoneForTeleCRM(body.phone);
  if (!phone) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const fields: Record<string, string> = { phone, name: body.name };
  if (body.email) fields.email = body.email;

  const details = [
    `Form Name: ${body.source || 'Website'}`,
    `Name: ${body.name || 'Not specified'}`,
    `Phone: ${body.phone || 'Not specified'}`,
    `Concern: ${body.concern || 'Not specified'}`,
    `Email: ${body.email || 'Not specified'}`,
    `Age: ${body.age || 'Not specified'}`,
    `Gender: ${body.gender || 'Not specified'}`,
    `Score: ${body.score ?? 'Not specified'}`,
    `URL: ${body.pageUrl || 'Not specified'}`,
  ].join(' | ');

  const payload = {
    fields,
    actions: [
      { type: 'SYSTEM_NOTE', text: `Details: ${details}` },
      { type: 'SYSTEM_NOTE', text: `Form Name: ${body.source || 'Website'}` },
      { type: 'SYSTEM_NOTE', text: `Name: ${body.name || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Phone: ${body.phone || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Condition: ${body.concern || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Email: ${body.email || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Age: ${body.age || 'Not specified'} | Gender: ${body.gender || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Hair score: ${body.score ?? 'Not specified'} (${body.band || 'n/a'})` },
      { type: 'SYSTEM_NOTE', text: `URL: ${body.pageUrl || 'Not specified'}` },
    ],
  };

  const qa = readableAnswers(body.gender, body.answers).filter((item) => item.answers.length);
  qa.forEach((item, i) => {
    payload.actions.push({
      type: 'SYSTEM_NOTE',
      text: `Q${i + 1}. ${item.question} - ${item.answers.join(', ')}`,
    });
  });
  if (body.medicalDetail) {
    payload.actions.push({ type: 'SYSTEM_NOTE', text: `Medical condition details: ${body.medicalDetail}` });
  }

  console.log('[TeleCRM] Sending payload:', JSON.stringify(payload));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
        'X-Client-ID': 'nextjs-website-integration',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 204) {
      console.log('[TeleCRM] Response: 204 No Content (lead accepted)');
      return {
        synced: true,
        statusCode: 204,
        note: 'TeleCRM accepted lead (204)',
      };
    }

    const text = await res.text();
    if (!text.trim()) {
      return { synced: false, statusCode: res.status, note: 'Empty TeleCRM response' };
    }

    let data: TelecrmResponse;
    try {
      data = JSON.parse(text) as TelecrmResponse;
    } catch {
      console.warn('[TeleCRM] Non-JSON response:', res.status, text.slice(0, 300));
      return {
        synced: false,
        statusCode: res.status,
        note: 'Non-JSON TeleCRM response',
      };
    }

    console.log('[TeleCRM] Response:', res.status, JSON.stringify(data));
    const confirmed = res.ok && isTelecrmConfirmed(data);
    return {
      ...data,
      synced: confirmed,
      statusCode: res.status,
      leadId: data.leadId || data.id || data.LeadID || null,
      note: confirmed ? 'TeleCRM lead confirmed' : 'TeleCRM did not confirm lead creation',
    };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    return { synced: false, note: 'TeleCRM fetch failed', error: message };
  }
}

function getTelecrmStatus(result: TelecrmResponse | null) {
  if (!result) return 'Not configured';
  if (result.synced) return `Synced${result.leadId ? ` (${String(result.leadId)})` : ''}`;
  return result.note || `Failed${result.statusCode ? ` (${result.statusCode})` : ''}`;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const body = normalizeSubmission(rawBody);

    if (!body.name || !body.phone || !body.concern) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and concern are required' },
        { status: 400 },
      );
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const telecrmResult = await pushToTeleCRM(body);
    const telecrmStatus = getTelecrmStatus(telecrmResult);
    let dbStatus = 'saved';
    try {
      await prisma.submission.create({
        data: {
          source: body.source,
          name: body.name,
          phone: body.phone,
          email: body.email || null,
          age: body.age || null,
          gender: body.gender || null,
          concern: body.concern,
          answers: body.answers ?? undefined,
          medicalDetail: body.medicalDetail || null,
          score: body.score,
          band: body.band || null,
          pageUrl: body.pageUrl || null,
          telecrmStatus,
        },
      });
    } catch (dbErr) {
      dbStatus = 'failed';
      console.error('Database save failed:', dbErr);
    }

    let excelStatus = getSheetWebhookUrl() ? 'failed' : 'not_configured';
    let excelError = '';
    try {
      const sheetResult = await pushToSheet(body, timestamp, telecrmStatus);
      if (sheetResult !== null) excelStatus = 'synced';
    } catch (gasErr) {
      excelError = (gasErr as Error).message;
      console.warn('Google Apps Script sync skipped:', excelError);
    }

    return NextResponse.json({
      success: true,
      database: dbStatus,
      excel: excelStatus,
      excelError,
      telecrm: telecrmResult,
    });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
