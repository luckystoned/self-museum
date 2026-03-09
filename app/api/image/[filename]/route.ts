import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const comfyUrl = process.env.NEXT_PUBLIC_COMFY_URL || 'http://127.0.0.1:8188';

    const response = await axios.get(`${comfyUrl}/view?filename=${filename}`, {
      responseType: 'arraybuffer'
    });

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
