import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a warm, professional real estate concierge for Prestige Properties. Your job is to have a natural, friendly conversation to collect the following 6 pieces of information from a potential home buyer:

1. Full name
2. Budget range
3. Preferred neighborhoods or areas
4. Number of bedrooms needed
5. Desired move-in timeline
6. Whether they are pre-approved for a mortgage (yes or no)

Rules:
- Ask only ONE question at a time
- Be conversational and warm, not robotic
- Acknowledge their answers naturally before asking the next question
- If they give vague answers, gently ask for clarification once
- Never mention that you are an AI unless directly asked — if asked, say "I'm the virtual concierge for Prestige Properties, here to get you started quickly."
- Keep responses concise — 1-3 sentences max
- Start by greeting them and asking for their name

IMPORTANT: Once you have collected ALL 6 pieces of information, you MUST end your response with this exact JSON block on a new line (no markdown, no code fences, just raw JSON):
INTAKE_COMPLETE:{"name":"...","budget":"...","neighborhoods":"...","bedrooms":"...","timeline":"...","preApproved":"yes/no"}

Do not include INTAKE_COMPLETE until you genuinely have all 6 pieces of information confirmed.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content || '';

    // Check if intake is complete
    const intakeMatch = content.match(/INTAKE_COMPLETE:(\{.*\})/);
    if (intakeMatch) {
      try {
        const intakeData = JSON.parse(intakeMatch[1]);
        const cleanContent = content.replace(/INTAKE_COMPLETE:\{.*\}/, '').trim();
        return NextResponse.json({ 
          message: cleanContent, 
          intakeComplete: true, 
          intakeData 
        });
      } catch {
        // JSON parse failed, continue normally
      }
    }

    return NextResponse.json({ message: content, intakeComplete: false });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
