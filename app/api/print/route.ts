import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();
    const outputPath = process.env.COMFY_OUTPUT_PATH;

    if (!outputPath) {
      throw new Error('COMFY_OUTPUT_PATH environment variable is not defined.');
    }

    const filePath = path.join(outputPath, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'File not found: ' + filePath
      }, { status: 404 });
    }

    // Use native mspaint with the PrintTo (/pt) flag to send to a specific printer silently
    // This avoids PowerShell STA thread hangs and bypasses 'Print to PDF' save dialogs if we define the physical printer
    const printerName = process.env.PRINTER_NAME || 'EPSON85A034 (L15150 Series)';
    const command = `mspaint /pt "${filePath}" "${printerName}"`;

    console.log('Executing print command:', command);
    await execPromise(command);

    return NextResponse.json({
      success: true,
      message: 'Print command sent successfully.'
    });
  } catch (error: any) {
    console.error('Error printing:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
