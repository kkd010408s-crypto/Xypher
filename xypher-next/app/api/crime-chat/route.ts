import { NextResponse } from 'next/server';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const SYSTEM_PROMPT = `You are XYPHER, an AI assistant specialized in crime-related information in India. Your knowledge includes:

- Indian Penal Code (IPC) and relevant laws
- Crime statistics and trends across Indian states/UTs
- Cybercrime awareness and prevention
- Women's safety laws and helplines
- How to report crimes (FIR, online complaints)
- Safety tips and precautions
- Information about NCRB (National Crime Records Bureau) data

Guidelines:
- Be informative, professional, and helpful
- Provide accurate information about Indian criminal law when asked
- Share relevant helpline numbers when appropriate (Women Helpline: 181, Police: 100, Cybercrime: 1930)
- If asked about something outside crime/safety in India, politely redirect to your expertise
- Keep responses concise but informative (under 200 words unless detailed explanation needed)
- Use bullet points for clarity when listing multiple items
- Never provide advice that could be used for illegal activities

Remember: You are helping users understand crime data, stay safe, and know their rights in India.`;

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
        }

        // Build conversation with system prompt
        const conversationMessages: Message[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: conversationMessages,
                temperature: 0.7,
                max_tokens: 800,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || 'Unable to generate response.';

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Crime Chat Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
