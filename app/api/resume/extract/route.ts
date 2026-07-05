import { NextResponse } from 'next/server';
import {
  extractProfileFromResume,
  ResumeTextExtractionError,
} from '@/agent/resume-extractor';
import { getCurrentUser } from '@/lib/auth';
import { createInsforgeServer } from '@/lib/insforge-server';
import { buildResumeStorageKey } from '@/lib/resume-storage';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_LOG_MESSAGE = 'Resume profile extraction requested';

export async function POST(): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 },
      );
    }

    const insforge = await createInsforgeServer();
    const rateLimitStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MS,
    ).toISOString();
    const { data: recentRequests, error: rateLimitReadError } =
      await insforge.database
        .from('agent_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('message', RATE_LIMIT_LOG_MESSAGE)
        .gte('created_at', rateLimitStart)
        .limit(RATE_LIMIT_MAX_REQUESTS);

    if (rateLimitReadError) {
      console.error('[api/resume/extract/rate-limit-read]', rateLimitReadError);
      return NextResponse.json(
        { error: 'Could not start resume extraction. Please try again.' },
        { status: 500 },
      );
    }

    if ((recentRequests ?? []).length >= RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many extraction attempts. Please wait five minutes.' },
        { status: 429, headers: { 'Retry-After': '300' } },
      );
    }

    const { error: rateLimitWriteError } = await insforge.database
      .from('agent_logs')
      .insert([
        {
          user_id: user.id,
          message: RATE_LIMIT_LOG_MESSAGE,
          level: 'info',
        },
      ]);

    if (rateLimitWriteError) {
      console.error(
        '[api/resume/extract/rate-limit-write]',
        rateLimitWriteError,
      );
      return NextResponse.json(
        { error: 'Could not start resume extraction. Please try again.' },
        { status: 500 },
      );
    }

    const resumeKey = buildResumeStorageKey(user.id);
    const { data: resume, error: downloadError } = await insforge.storage
      .from('resumes')
      .download(resumeKey);

    if (downloadError || !resume) {
      console.error('[api/resume/extract/download]', downloadError);
      return NextResponse.json(
        { error: 'Upload a resume before extracting profile details.' },
        { status: 404 },
      );
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const profile = await extractProfileFromResume(resumeBuffer);

    return NextResponse.json({ profile });
  } catch (error: unknown) {
    if (error instanceof ResumeTextExtractionError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error('[api/resume/extract]', error);
    return NextResponse.json(
      { error: 'Could not extract profile details. Please try again.' },
      { status: 500 },
    );
  }
}
