import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ prompt_id: string }> }
) {
  try {
    const { prompt_id } = await params;
    const comfyUrl = process.env.NEXT_PUBLIC_COMFY_URL || 'http://127.0.0.1:8188';

    const response = await axios.get(`${comfyUrl}/history/${prompt_id}`);
    const history = response.data[prompt_id];

    if (history) {
      // Completed!
      const outputs = history.outputs;
      // Get the last node output that has images
      const lastNodeId = Object.keys(outputs).pop() || '';
      const images = outputs[lastNodeId]?.images || [];
      const filename = images[0]?.filename;

      return NextResponse.json({
        status: 'completed',
        filename: filename
      });
    }

    return NextResponse.json({
      status: 'processing'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
