import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const message = searchParams.get('message');
  const type = searchParams.get('type');

  if (!message || !type) {
    return NextResponse.json({ error: 'Missing message or type parameter' }, { status: 400 });
  }

  const endpoint = type === 'chat'
    ? 'https://nebula.thirdweb-dev.com/v1/chat'
    : 'https://nebula.thirdweb-dev.com/v1/code';

  try {
    const response = await fetch(`${endpoint}?message=${encodeURIComponent(message)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from API' }, { status: 500 });
  }
}