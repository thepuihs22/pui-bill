import { nanoid } from 'nanoid';

// In-memory storage (replace with your database in production)
const shareStorage = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const shareId = nanoid(10); // Generates a 10-character unique ID
    shareStorage.set(shareId, data);

    // Remove old data after 24 hours
    setTimeout(() => {
      shareStorage.delete(shareId);
    }, 24 * 60 * 60 * 1000);

    return Response.json({ shareId });
  } catch (error) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return Response.json({ error: 'No ID provided' }, { status: 400 });
  }

  const data = shareStorage.get(id);
  if (!data) {
    return Response.json({ error: 'Share not found' }, { status: 404 });
  }

  return Response.json(data);
} 