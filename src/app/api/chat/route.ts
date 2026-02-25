import { NextResponse } from 'next/server';

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

    // Construir mensajes para Groq
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT }
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

    // Verificar si hay API key de Groq
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Sin API key, usar respuestas locales predefinidas
      const localResponse = generateLocalResponse(message);
      return NextResponse.json({
        success: true,
        response: localResponse,
        source: 'local'
      });
    }

    // Llamar a la API de Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      // Fallback a respuesta local
      const localResponse = generateLocalResponse(message);
      return NextResponse.json({
        success: true,
        response: localResponse,
        source: 'local_fallback'
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      response: aiResponse,
      source: 'groq'
    });

  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  }
}

// Respuestas locales cuando no hay API disponible
function generateLocalResponse(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('berrinch') || lower.includes('pataleta') || lower.includes('llora') || lower.includes('grita')) {
    return `**💚 Validación para ti**
Entiendo lo agotador que puede ser manejar estas situaciones. Es completamente normal sentirse frustrado/a.

**🧠 ¿Qué está pasando?**
Los berrinches son una forma de comunicación. Tu hijo está expresando una emoción que no puede regular por sí solo. Su cerebro aún no tiene las herramientas para manejar la frustración.

**✨ Qué hacer**
1. Mantén la calma y respira profundamente antes de actuar
2. Quédate cerca sin intentar "arreglar" inmediatamente
3. Valida la emoción: "Veo que estás muy molesto/a"

**💬 Frases que puedes usar**
- "Tus sentimientos son muy grandes ahora. Estoy aquí contigo."
- "Cuando estés listo/a para hablar, yo estaré aquí."
- "¿Quieres un abrazo o prefieres espacio?"
- "Entiendo que querías eso. No se puede hoy."

**⚠️ Qué evitar**
- Tratar de razonar durante el berrinche
- Ceder solo para que pare de llorar
- Amenazar o regañar

**📚 Por qué funciona**
La co-regulación ayuda al niño a desarrollar conexiones neuronales para la autorregulación futura. Tu calma es su ancla.`;
  }

  if (lower.includes('pelean') || lower.includes('hermano') || lower.includes('pelea')) {
    return `**💚 Validación para ti**
Las peleas entre hermanos son una de las situaciones más desgastantes. No estás solo/a en esto, es muy común.

**🧠 ¿Qué está pasando?**
Los hermanos compiten por recursos limitados: tu atención, tiempo y afecto. Es una búsqueda natural de pertenencia y conexión.

**✨ Qué hacer**
1. No tomes partido inmediatamente
2. Ofrece ayuda para resolver, no soluciones impuestas
3. Enseña a negociar y turnarse

**💬 Frases que puedes usar**
- "Veo dos niños con un problema. ¿Quieren ayuda para resolverlo?"
- "Cada uno me cuenta su versión sin interrumpir."
- "¿Qué solución funciona para los dos?"
- "Este juguete es para compartir. Si no pueden, lo guardo."

**⚠️ Qué evitar**
- Comparar a los hermanos entre sí
- Siempre culpar al mayor
- Ignorar el conflicto por completo

**📚 Por qué funciona**
Cuando los niños participan en la solución, desarrollan habilidades de negociación y empatía que les servirán toda la vida.`;
  }

  if (lower.includes('grito') || lower.includes('gritar') || lower.includes('límite') || lower.includes('limites')) {
    return `**💚 Validación para ti**
Queremos poner límites sin gritar, pero a veces es difícil. Eso no te hace un mal padre/madre. Es señal de que estás al límite de tu capacidad.

**🧠 ¿Qué está pasando?**
Los gritos suelen ser una señal de que nuestro sistema nervioso está sobrecargado. Es una reacción de lucha o huida ante el estrés.

**✨ Qué hacer**
1. Pausa antes de reaccionar: respira 3 veces profundamente
2. Usa un tono firme pero tranquilo
3. Conecta antes de corregir

**💬 Frases que puedes usar**
- "Es hora de cenar. ¿Lavas las manos tú o te ayudo?"
- "Entiendo que quieres seguir. Primero esto, luego aquello."
- "En esta familia nos hablamos con respeto. Intentémoslo de nuevo."
- "Necesito un momento para calmarme. Luego hablamos."

**⚠️ Qué evitar**
- Amenazar sin cumplir lo que dices
- Dar explicaciones muy largas
- Pedir perdón excesivamente

**📚 Por qué funciona**
Los límites firmes Y amables enseñan respeto sin generar miedo ni resentimiento. El cerebro aprende mejor cuando no está en defensa.`;
  }

  if (lower.includes('tarea') || lower.includes('estudiar') || lower.includes('deberes') || lower.includes('escuela')) {
    return `**💚 Validación para ti**
La batalla de las tareas es muy común en casi todas las familias. Es comprensible que te frustres.

**🧠 ¿Qué está pasando?**
Después de un día largo en la escuela, los niños tienen poca energía mental para tareas que requieren esfuerzo sostenido. Su tanque de voluntad está vacío.

**✨ Qué hacer**
1. Establece una rutina consistente con horario fijo
2. Divide las tareas grandes en pasos pequeños
3. Ofrece compañía, no respuestas

**💬 Frases que puedes usar**
- "¿Qué parte te cuesta más? Vamos a revisarla juntos."
- "¿Cuánto tiempo necesitas? ¿20 o 30 minutos?"
- "Primero terminamos esto, luego puedes jugar."
- "No necesitas hacerlo perfecto, solo hacerlo."

**⚠️ Qué evitar**
- Hacer la tarea por el niño
- Usar la tarea como castigo
- Exigir perfección constante

**📚 Por qué funciona**
La autonomía gradual desarrolla autodisciplina. Los niños necesitan sentir que pueden hacerlo, no que es perfecto.`;
  }

  // Respuesta por defecto
  return `**💚 Validación para ti**
Gracias por compartir esta situación. Es valioso que busques herramientas para manejarla mejor. Cada desafío es una oportunidad de conexión.

**🧠 ¿Qué está pasando?**
Cada comportamiento tiene un propósito. Tu hijo está tratando de comunicar una necesidad, aunque no siempre de la manera más adecuada.

**✨ Qué hacer**
1. Observa sin juzgar: ¿Qué necesita realmente mi hijo?
2. Conecta antes de corregir: el vínculo primero
3. Ofrece alternativas aceptables

**💬 Frases que puedes usar**
- "Veo que esto es difícil para ti. Estoy aquí para ayudar."
- "¿Qué necesitas en este momento?"
- "Hablemos de esto cuando estemos más tranquilos."
- "Te entiendo. Vamos a buscar una solución juntos."

**⚠️ Qué evitar**
- Reaccionar desde el enojo o el agotamiento
- Interpretar malicia donde hay falta de habilidad
- Ignorar tus propias necesidades emocionales

**📚 Por qué funciona**
La conexión emocional fortalece el vínculo y aumenta naturalmente la cooperación del niño. El cerebro conectado coopera mejor.`;
}
