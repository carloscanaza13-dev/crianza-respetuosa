import ZAI from 'z-ai-web-dev-sdk';

// Sistema especializado en crianza respetuosa
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
[Una frase de validación emocional hacia el padre/madre, reconociendo lo difícil de la situación]

**🧠 ¿Qué está pasando?**
[Explicación breve y clara del comportamiento infantil desde el desarrollo evolutivo]

**✨ Qué hacer**
[2-3 estrategias prácticas y específicas, numeradas]

**💬 Frases que puedes usar**
[3-4 frases modelo exactas que el padre pueda decir, en comillas]

**⚠️ Qué evitar**
[2-3 acciones comunes que empeoran la situación]

**📚 Por qué funciona**
[Explicación breve del fundamento psicológico]

## Tono de Comunicación
- Empático pero firme
- Claro y estructurado
- Sin juicios
- Evita lenguaje técnico excesivo
- Usa ejemplos concretos
- Lenguaje accesible para padres latinoamericanos

## Límites Éticos
- NO diagnosticas trastornos
- NO reemplazas terapia psicológica
- Si detectas riesgo de violencia grave o maltrato, sugieres buscar ayuda profesional
- Siempre mencionas: "Esta orientación es psicoeducativa y no sustituye atención profesional"

## Categorías de Consulta Comunes
- Berrinches y pataletas
- Desobediencia
- Peleas entre hermanos
- Uso de pantallas/tecnología
- Tareas escolares
- Problemas para dormir
- Conductas agresivas
- Mentiras
- Desafíos con TDAH
- Regulación emocional parental

Recuerda: Tu objetivo es empoderar a los padres con herramientas prácticas basadas en evidencia, promoviendo relaciones familiares respetuosas y saludables.`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export interface ConsultationResponse {
  response: string;
  category: string;
}

export async function generateConsultationResponse(
  situation: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ConsultationResponse> {
  const zai = await getZAI();

  // Construir mensajes con historial
  const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
    { role: 'assistant', content: SYSTEM_PROMPT }
  ];

  // Agregar historial de conversación
  for (const msg of conversationHistory) {
    messages.push(msg);
  }

  // Agregar mensaje actual
  messages.push({ role: 'user', content: situation });

  const completion = await zai.chat.completions.create({
    messages,
    thinking: { type: 'disabled' }
  });

  const response = completion.choices[0]?.message?.content || '';

  // Detectar categoría basada en palabras clave
  const category = detectCategory(situation);

  return { response, category };
}

function detectCategory(situation: string): string {
  const lowerSituation = situation.toLowerCase();
  
  if (lowerSituation.includes('berrinche') || lowerSituation.includes('pataleta') || lowerSituation.includes('llora') || lowerSituation.includes('grita')) {
    return 'berrinches';
  }
  if (lowerSituation.includes('desobedien') || lowerSituation.includes('no hace caso') || lowerSituation.includes('no quiere')) {
    return 'desobediencia';
  }
  if (lowerSituation.includes('hermano') || lowerSituation.includes('pelean') || lowerSituation.includes('pelea')) {
    return 'hermanos';
  }
  if (lowerSituation.includes('pantalla') || lowerSituation.includes('celular') || lowerSituation.includes('tele') || lowerSituation.includes('videojuego')) {
    return 'pantallas';
  }
  if (lowerSituation.includes('tarea') || lowerSituation.includes('escuela') || lowerSituation.includes('estudiar') || lowerSituation.includes('deberes')) {
    return 'tareas';
  }
  if (lowerSituation.includes('dormir') || lowerSituation.includes('sueño') || lowerSituation.includes('noche')) {
    return 'sueno';
  }
  if (lowerSituation.includes('golpea') || lowerSituation.includes('agresiv') || lowerSituation.includes('muerde')) {
    return 'agresividad';
  }
  if (lowerSituation.includes('miente') || lowerSituation.includes('mentira')) {
    return 'mentiras';
  }
  if (lowerSituation.includes('tdah') || lowerSituation.includes('hiperactiv') || lowerSituation.includes('atencion')) {
    return 'tdah';
  }
  
  return 'general';
}

// Función para generar consejos cortos
export async function generateQuickTip(topic: string): Promise<string> {
  const zai = await getZAI();

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: `${SYSTEM_PROMPT}\n\nAhora responde de forma MUY BREVE (máximo 2 oraciones) con un consejo práctico sobre el tema.` },
      { role: 'user', content: `Dame un consejo rápido sobre: ${topic}` }
    ],
    thinking: { type: 'disabled' }
  });

  return completion.choices[0]?.message?.content || '';
}
