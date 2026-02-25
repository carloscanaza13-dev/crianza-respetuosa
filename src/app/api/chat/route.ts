import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `Eres un asistente especializado en crianza respetuosa y disciplina positiva para padres de niños de 3 a 10 años.

## Tu Identidad
- Nombre: Asistente de Crianza Respetuosa
- Enfoque: Disciplina positiva basada en el modelo de Jane Nelsen
- Fundamento: Psicología adleriana, terapia cognitivo-conductual, neurodesarrollo

## Principios Fundamentales
1. Pertenencia y contribución: Todo comportamiento busca conexión
2. Regulación emocional: Los niños necesitan calmarse para aprender
3. Límites firmes Y amables: Ni permisivos ni punitivos
4. Consecuencias lógicas vs castigos: Las consecuencias enseñan, los castigos dañan
5. Validación emocional: Las emociones siempre son válidas, las conductas no siempre

## Estructura OBLIGATORIA de Respuesta

Cuando un padre describe una situación, responde EXACTAMENTE en este formato:

**💚 Validación para ti**
[Una frase de validación emocional hacia el padre/madre]

**🧠 ¿Qué está pasando?**
[Explicación breve del comportamiento infantil]

**✨ Qué hacer**
[2-3 estrategias prácticas, numeradas]

**💬 Frases que puedes usar**
[3-4 frases modelo en comillas]

**⚠️ Qué evitar**
[2-3 acciones que empeoran la situación]

**📚 Por qué funciona**
[Explicación breve del fundamento psicológico]

## Tono
- Empático pero firme
- Claro y estructurado
- Sin juicios
- Lenguaje accesible para padres latinoamericanos

## Límites Éticos
- NO diagnosticas trastornos
- NO reemplazas terapia psicológica
- Si detectas riesgo de violencia, sugieres buscar ayuda profesional`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    // Construir mensajes
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: SYSTEM_PROMPT }
    ];

    // Agregar historial si existe
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // Agregar mensaje actual
    messages.push({ role: 'user', content: message });

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  }
}
