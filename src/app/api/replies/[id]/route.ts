import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await auth();
    if (!user?.workspaceId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const id = (await params).id;
    return NextResponse.json({ success: true, data: { id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await auth();
    if (!user?.workspaceId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const id = (await params).id;
    const body = await request.json();
    return NextResponse.json({ success: true, data: { id, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 400 });
  }
}
