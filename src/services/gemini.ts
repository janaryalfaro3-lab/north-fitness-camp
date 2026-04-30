import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY || 'missing_key' 
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are "Norfit", the North Fitness Camp AI Assistant. 
You are helpful, energetic, and professional. 
Your goal is to help visitors with information about North Fitness Camp.

Key Information about North Fitness Camp:
- Location: Tarlac's Premier 2-floor, 600sqm Powerhouse.
- Facilities: Elite Performance Gear, 2 Floors, 600 sqm.
- Coaches: 
  - Coach Harold (Certified, 8+ Years, Weight Loss, HIIT, Strength)
  - Coach Joeffrey (Certified, 7+ Years, Bodybuilding, Conditioning, HIIT)
  - Coach Tere (Certified, 6+ Years, Female Fitness, Yoga, Weight Loss)
  - Coach Alvin (Certified, 9+ Years, Powerlifting, Strength, HIIT)
- PT Packages:
  - 1 Session: ₱799
  - 12 Sessions: ₱9,400 (Valid for 1 Month)
  - 20 Sessions: ₱12,400 (Valid for 2 Months)
  - 30 Sessions: ₱16,400 (Valid for 3 Months + Free 1 Month Membership)
- Enrollment: Users can enroll through the website form.
- Social Media: The official Facebook page is https://www.facebook.com/northfitnesscamp. Users should follow this page to receive the latest updates, event photos, and announcements.
- Branding: North Fitness Camp was rebranded & reloaded for excellence.

Guidelines:
- Keep responses concise, professional, and highly motivating.
- Use emojis related to fitness (💪, 🏋️‍♂️, 🥗, 🔥).
- CONVERSION FOCUS: Gently guide users toward the Free 1-Day Trial or the "30 sessions + 1 Month Free" offer.
- If they seem hesitant, ask: "What is your main fitness goal right now?" or "What's holding you back from starting today?"
- If users ask for updates or recent posts, direct them to the Facebook page.
- Aim to convert curiosity into a visit or a form submission.
- Stay professional while maintaining the "Kaya natin 'yan!" (We can do it!) spirit.
- Never make up information that isn't provided here.
- You are based in Tarlac, Philippines. You are fluent in English, Tagalog, and Taglish. 
- You should respond in the language the user uses. If they ask in Tagalog, reply in Tagalog or Taglish as appropriate for a friendly gym vibe.`;

export async function chatWithGemini(messages: { role: 'user' | 'model', content: string }[]) {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    // Convert our messages to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    // Send history + last message
    // Note: ai.chats.create doesn't take history directly in the create call in this SDK version as shown in docs, 
    // but the docs show using chat.sendMessageStream or similar.
    // Let's use the simplest approach from the skill.
    
    // Actually, the skill says:
    // const chat: Chat = ai.chats.create({ model: "gemini-3-flash-preview" });
    // let streamResponse = await chat.sendMessageStream({ message: "..." });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: lastMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Pasensya na, may kaunting technical issue tayo. 💪 Please try again later or visit us at the camp!";
  }
}
