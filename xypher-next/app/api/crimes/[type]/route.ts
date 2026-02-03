import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;

    // Map the URL parameter "type" to the actual filename
    const typeToFileMap: Record<string, string> = {
        women: 'crimes_against_women_2022.metrics.json',
        cyber: 'cyber_crime_2022.metrics.json',
        economic: 'economic_crime_2022.metrics.json',
        murder: 'murder_homicide_2022.metrics.json',
    };

    const filename = typeToFileMap[type];

    if (!filename) {
        return NextResponse.json(
            { error: 'Invalid crime type. Available types: women, cyber, economic, murder' },
            { status: 400 }
        );
    }

    try {
        // Construct the path to the data file
        const filePath = path.join(process.cwd(), 'data', filename);

        // Read the file asynchronously
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        // Return the data as JSON
        return NextResponse.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Error reading data file:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: 'Failed to read data source.' },
            { status: 500 }
        );
    }
}
