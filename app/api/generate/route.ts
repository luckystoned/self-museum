import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const comfyUrl = process.env.NEXT_PUBLIC_COMFY_URL || 'http://127.0.0.1:8188';

    // Read workflow template
    const workflowPath = path.join(process.cwd(), 'comfy_workflow.json');
    const workflowTemplate = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

    // Inject prompt and random seed
    workflowTemplate["6"].inputs.text = workflowTemplate["6"].inputs.text.replace('{prompt}', prompt);
    workflowTemplate["3"].inputs.seed = Math.floor(Math.random() * 1000000000000000);

    const response = await axios.post(`${comfyUrl}/prompt`, {
      prompt: workflowTemplate
    });

    return NextResponse.json({
      success: true,
      prompt_id: response.data.prompt_id
    });
  } catch (error: any) {
    console.error('Error queuing prompt:', error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
