import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await auth();
    if (!user?.workspaceId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const id = (await params).id;
    return NextResponse.json({ success: true, data: { id, status: 'resumed' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 400 });
  }
}
