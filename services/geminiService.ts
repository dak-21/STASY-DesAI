import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEmergencyPlan = async (density: number): Promise<string> => {
  if (!apiKey) {
      console.warn("API Key is missing for Gemini Service");
      return "Simulation Mode: API Key missing. Deploy police to Sector A immediately. Prepare triage at City Hospital.";
  }

  const prompt = `
    Context: STASY (Stampede Management System) has detected a high crowd density of ${density}% in a public sector. 
    Role: You are an emergency response coordinator AI.
    Task: Generate a very concise, bulleted emergency action plan.
    Format:
    - **Police Action**: [2-3 immediate crowd control tactics]
    - **Medical Response**: [2 immediate triage instructions]
    - **Public Announcement**: [1 sentence to broadcast]
    
    Keep it strictly professional, urgent, and under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Command Center. Default Protocol: 1. Disperse Crowd. 2. Notify EMS.";
  }
};