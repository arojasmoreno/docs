
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { IndustrialDocument, Language } from "../types";

// The GoogleGenAI client is initialized inside functions to ensure it uses the most current API key from process.env.API_KEY.

export const getAIExplanation = async (doc: IndustrialDocument, lang: Language = 'es') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explica brevemente la importancia de este documento industrial de Samsic: "${doc.title}" de tipo "${doc.type}". 
      Contexto: ${doc.description}. Responde en el idioma "${lang}" de forma profesional y concisa para un operario de fábrica de Samsic.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error.";
  }
};

export const simulatePasswordRecovery = async (email: string, name: string, lang: Language = 'es') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera el texto de un correo electrónico profesional de Samsic para un empleado llamado ${name} (${email}) que ha solicitado recuperar su contraseña de Samsic Doc Manager. 
      Responde en el idioma "${lang}". El tono debe ser corporativo, seguro y tranquilizador. Indica que se ha enviado un enlace temporal. Responde solo el cuerpo del mensaje.`,
      config: { temperature: 0.8 }
    });
    return response.text;
  } catch (error) {
    return `Estimado ${name}, se ha enviado un enlace de recuperación a su correo corporativo ${email}.`;
  }
}

export const searchDocumentsAI = async (query: string, docs: IndustrialDocument[], lang: Language = 'es') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const docContext = docs.map(d => `${d.title} (${d.type}): ${d.description}`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `El usuario busca en la base de Samsic: "${query}". Basándote en esta lista de documentos: \n${docContext}\n\n 
        ¿Qué documentos son los más relevantes? Responde en el idioma "${lang}" con una recomendación breve de 2 líneas resaltando el más crítico.`,
      });
      return response.text;
    } catch (error) {
      return null;
    }
}

/**
 * Crea una sesión de chat configurada con el contexto de la biblioteca actual de Samsic y soporte multi-idioma.
 */
export const createIndustrialChat = (docs: IndustrialDocument[], lang: Language = 'es') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const docContext = docs.map(d => `- [${d.type}] ${d.title}: ${d.description}`).join('\n');
  
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Eres "SamsicBot", el asistente virtual inteligente de Samsic Doc Manager.
      Tu objetivo es ayudar al personal de Samsic a:
      1. Realizar trabajos de limpieza y mantenimiento siguiendo las instrucciones oficiales.
      2. Operar maquinaria industrial con seguridad.
      3. Consultar FDS para productos químicos.
      
      BASE DE CONOCIMIENTOS DE SAMSIC:
      ${docContext}
      
      REGLAS DE ORO:
      - Responde siempre en el idioma solicitado: "${lang}" (puede ser Castellano, Francés, Marroquí/Darija o Wolof).
      - Sé extremadamente conciso y prioriza la seguridad física.
      - Si el usuario pregunta algo que no está en los documentos, indícale claramente que debe consultar con su Jefe de Centro.
      - Menciona siempre el nombre del documento oficial de Samsic al dar una instrucción.`
    }
  });
};
