import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { crimeType, crimeData } = await request.json();

        if (!crimeData || crimeData.length === 0) {
            return NextResponse.json({ error: 'No crime data provided' }, { status: 400 });
        }

        // Prepare a summary of the data for the AI
        const totalCrimes = crimeData.reduce((sum: number, d: any) => sum + d.total_crimes, 0);
        const highestState = crimeData.reduce((prev: any, current: any) =>
            (prev.crime_index > current.crime_index) ? prev : current
        );
        const lowestState = crimeData.reduce((prev: any, current: any) =>
            (prev.crime_index < current.crime_index) ? prev : current
        );

        // Count severity distribution
        const severityCounts: { [key: string]: number } = {};
        crimeData.forEach((d: any) => {
            severityCounts[d.severity] = (severityCounts[d.severity] || 0) + 1;
        });

        const dataContext = `
Crime Type: ${crimeType.replace(/_/g, ' ').toUpperCase()}
Total Reported Crimes: ${totalCrimes.toLocaleString()}
Number of States/UTs Analyzed: ${crimeData.length}

Highest Crime Index: ${highestState.state} with index ${highestState.crime_index} (${highestState.total_crimes.toLocaleString()} crimes, Severity: ${highestState.severity})
Lowest Crime Index: ${lowestState.state} with index ${lowestState.crime_index} (${lowestState.total_crimes.toLocaleString()} crimes, Severity: ${lowestState.severity})

Severity Distribution:
${Object.entries(severityCounts).map(([severity, count]) => `- ${severity}: ${count} states/UTs`).join('\n')}

Top 5 States by Crime Index:
${[...crimeData].sort((a: any, b: any) => b.crime_index - a.crime_index).slice(0, 5).map((d: any, i: number) =>
            `${i + 1}. ${d.state}: Index ${d.crime_index}, ${d.total_crimes.toLocaleString()} crimes`
        ).join('\n')}
`;

        const prompt = `You are a crime data analyst. Based on the following crime statistics data from India, provide a concise analytical summary.

DATA:
${dataContext}

INSTRUCTIONS:
- Write a brief introductory paragraph (2-3 sentences) summarizing the overall situation
- Then provide 4-5 bullet points highlighting key insights
- Be specific with numbers and state names
- Mention any concerning patterns or notable observations
- Keep the tone professional and analytical
- Total response should be under 200 words

FORMAT YOUR RESPONSE AS:
[Paragraph]

• [Bullet point 1]
• [Bullet point 2]
• [Bullet point 3]
• [Bullet point 4]
• [Bullet point 5]`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
        }

        const data = await response.json();
        const summary = data.choices[0]?.message?.content || 'Unable to generate summary.';

        return NextResponse.json({ summary });
    } catch (error) {
        console.error('AI Overview Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
