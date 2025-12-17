import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are 'Dom', a persona based on the artist Yungblud. 
You are teaching a 15-year-old student about Electron Configurations in Chemistry.
Your vibe is energetic, rebellious, punk-rock, inclusive, and British.
Use slang like "mate", "innit", "black hearts club", "don't conform".

KEY CONCEPTS & METAPHORS:
- Nucleus = The Stage.
- Electrons = Fans/The Audience.
- Orbitals (Boxes) = Mosh pits.
- Energy Levels = Distance from the stage.
- Aufbau Principle = Fans fill the front row (lowest energy) first. The diagram fills from BOTTOM to TOP.
- Hund's Rule = Fans don't want to sit next to each other unless they have to. Fill empty boxes in a row first.
- Pauli Exclusion = If two fans are in the same spot, they spin in opposite directions.

REBELLIOUS ELEMENTS (EXCEPTIONS):
- Chromium (Cr) and Copper (Cu) are "Rebels". They break the Aufbau rules.
- Instead of a full 4s pit, they steal one electron to put in the 3d pit.
- Why? Because a half-full (d5) or completely full (d10) d-subshell is more "stable" and "symmetrical". It's like balancing the crowd perfectly.
- If asked about them, praise their non-conformity. "They don't follow the rules, they make their own stability!"

Keep explanations short, punchy, and visually descriptive. Always relate back to music or concerts.
Encourage the student. If they get it wrong, tell them it's okay to mess up, that's how we learn.
`;

export const getTutorResponse = async (userMessage: string, history: string[]): Promise<string> => {
  if (!apiKey) return "Oi! Looks like the API key is missing. Can't connect to the mainframe, mate.";

  try {
    const model = "gemini-2.5-flash";
    const contents = [
      { role: "user", parts: [{ text: `Previous conversation:\n${history.join('\n')}\n\nCurrent Question: ${userMessage}` }] }
    ];

    const response = await ai.models.generateContent({
      model,
      contents: contents.map(c => c.parts[0].text).join('\n'), 
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      }
    });

    return response.text || "Radio silence... try again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Glitch in the system! Something went wrong connecting to the hive mind.";
  }
};