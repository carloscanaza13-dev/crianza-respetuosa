import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Frases modelo organizadas por categoría
const PHRASES_DATABASE = {
  berrinches: {
    title: "Berrinches y Pataletas",
    description: "Frases para momentos de descontrol emocional",
    phrases: [
      {
        phrase: "Veo que estás muy molesto/a. Es difícil cuando no podemos tener lo que queremos.",
        context: "Cuando el niño llora por algo que no puede tener",
        tip: "Valida la emoción antes de redirigir"
      },
      {
        phrase: "Tus sentimientos son muy grandes ahora. Estoy aquí contigo.",
        context: "Durante el berrinche",
        tip: "Presencia tranquila sin intentar 'arreglar'"
      },
      {
        phrase: "Cuando estés listo/a para hablar, yo estaré aquí esperándote.",
        context: "Cuando el niño está gritando",
        tip: "Ofrece espacio sin abandonar"
      },
      {
        phrase: "Tu cuerpo necesita calmarse. ¿Quieres un abrazo o prefieres espacio?",
        context: "Ofreciendo opciones de regulación",
        tip: "El niño elige cómo regularse"
      },
      {
        phrase: "Entiendo que querías ese juguete. No se puede comprar hoy, y está bien que te sientas triste.",
        context: "En tienda o lugar público",
        tip: "Límite claro + validación"
      }
    ]
  },
  desobediencia: {
    title: "Desobediencia",
    description: "Frases para cuando el niño no sigue instrucciones",
    phrases: [
      {
        phrase: "Sé que quieres seguir jugando. Es hora de cenar. ¿Prefieres lavarte las manos tú o te ayudo?",
        context: "Transiciones difíciles",
        tip: "Ofrece elección dentro del límite"
      },
      {
        phrase: "La pregunta no es si vas a bañarte, es cuándo. ¿Ahora o en 5 minutos?",
        context: "Cuando se niega a cooperar",
        tip: "Límite firme con autonomía limitada"
      },
      {
        phrase: "Te escucho diciendo que no quieres. Entiendo. Esto necesita hacerse. ¿Cómo te gustaría hacerlo?",
        context: "Negativa constante",
        tip: "Valida + mantén expectativa + ofrece flexibilidad"
      },
      {
        phrase: "Cuando digas 'no' a limpiar, los juguetes descansan en la caja hasta mañana.",
        context: "Consecuencia lógica",
        tip: "Consecuencia relacionada, no castigo"
      },
      {
        phrase: "Parece que necesitas ayuda. Vamos a hacerlo juntos.",
        context: "Cuando hay resistencia",
        tip: "Conexión antes que corrección"
      }
    ]
  },
  hermanos: {
    title: "Peleas entre Hermanos",
    description: "Frases para mediar conflictos fraternos",
    phrases: [
      {
        phrase: "Veo dos niños que tienen un problema. ¿Quieren ayuda para resolverlo o lo resuelven ustedes?",
        context: "Inicio de conflicto",
        tip: "Fomenta autonomía, ofrece apoyo"
      },
      {
        phrase: "Aquí no se golpea. Vamos a separarnos un momento y luego hablamos.",
        context: "Conflicto físico",
        tip: "Seguridad primero, luego enseñanza"
      },
      {
        phrase: "Cada uno me cuenta su versión sin interrumpir. Tú primero, luego tú.",
        context: "Ambos quieren hablar",
        tip: "Estructura para escucha"
      },
      {
        phrase: "Este juguete es para compartir. Si no pueden compartirlo, lo guardo por ahora.",
        context: "Disputa por objeto",
        tip: "Consecuencia lógica neutral"
      },
      {
        phrase: "¿Qué solución se les ocurre que funcione para los dos?",
        context: "Buscando resolución",
        tip: "Desarrolla resolución de problemas"
      }
    ]
  },
  pantallas: {
    title: "Uso de Pantallas",
    description: "Frases para manejar tecnología",
    phrases: [
      {
        phrase: "El tiempo de pantalla terminó. ¿Quieres apagar tú o lo hago yo?",
        context: "Fin del tiempo permitido",
        tip: "Elección dentro del límite"
      },
      {
        phrase: "Sé que es difícil apagar. El cerebro quiere seguir. Es hora de hacer otra cosa.",
        context: "Resistencia al cambio",
        tip: "Normaliza la dificultad + mantén límite"
      },
      {
        phrase: "Las pantallas descansan después de cenar. Esa es la regla de nuestra familia.",
        context: "Regla clara establecida",
        tip: "Reglas consistentes sin negociación"
      },
      {
        phrase: "Tu cuerpo necesita moverse. ¿Qué prefieres hacer: saltar o dibujar?",
        context: "Ofrecer alternativas activas",
        tip: "Transición a actividad física"
      },
      {
        phrase: "Aprecio cómo apagaste sin quejarte. Eso muestra madurez.",
        context: "Después de cooperar",
        tip: "Refuerza comportamiento positivo"
      }
    ]
  },
  tareas: {
    title: "Tareas Escolares",
    description: "Frases para acompañar en deberes",
    phrases: [
      {
        phrase: "Veo que la tarea es difícil. ¿Qué parte te cuesta más? Vamos a revisarla juntos.",
        context: "Frustración con tarea",
        tip: "Identifica obstáculo específico"
      },
      {
        phrase: "¿Cuánto tiempo necesitas? ¿30 minutos o 45?",
        context: "Planificación",
        tip: "Estimación y compromiso"
      },
      {
        phrase: "Primero terminamos la tarea, luego puedes jugar. ¿Por cuál tarea empiezas?",
        context: "Secuencia clara",
        tip: "Primero/luego + elección"
      },
      {
        phrase: "No necesitas hacerlo perfecto. Necesitas hacerlo.",
        context: "Perfeccionismo",
        tip: "Reduce presión"
      },
      {
        phrase: "Tómate un descanso de 5 minutos. Cuando regreses, continuamos.",
        context: "Sobrecarga",
        tip: "Pausas estructuradas"
      }
    ]
  },
  dormir: {
    title: "Problemas para Dormir",
    description: "Frases para la hora de dormir",
    phrases: [
      {
        phrase: "Tu cuerpo necesita descansar para tener energía mañana. Es hora de dormir.",
        context: "Se niega a dormir",
        tip: "Explicación simple del por qué"
      },
      {
        phrase: "Puedo leerte un cuento o cantarte una canción. ¿Cuál prefieres?",
        context: "Rutina nocturna",
        tip: "Elección dentro de la rutina"
      },
      {
        phrase: "Sé que no quieres dormir. Es hora de dormir. Estaré cerca si me necesitas.",
        context: "Resistencia con miedo",
        tip: "Valida + límite + disponibilidad"
      },
      {
        phrase: "Un vaso de agua, un beso, y luego a dormir. Esas son las reglas de noche.",
        context: "Peticiones repetidas",
        tip: "Reglas claras y consistentes"
      },
      {
        phrase: "Tu muñeco también tiene sueño. Vamos a acostarlo contigo.",
        context: "Usar transición suave",
        tip: "Acompañamiento simbólico"
      }
    ]
  },
  agresividad: {
    title: "Conductas Agresivas",
    description: "Frases para agresividad física o verbal",
    phrases: [
      {
        phrase: "Aquí no se golpea. Me voy a asegurar de que todos estén seguros.",
        context: "Golpea a otros",
        tip: "Seguridad inmediata sin sermones"
      },
      {
        phrase: "Estás muy enojado/a. Golpear no está permitido. ¿Qué necesitas expresar?",
        context: "Después de golpear",
        tip: "Valida emoción + límite + alternativas"
      },
      {
        phrase: "Las palabras pueden lastimar. En esta familia nos hablamos con respeto.",
        context: "Insultos o groserías",
        tip: "Límite sobre comunicación"
      },
      {
        phrase: "Cuando estés calmado/a podemos hablar. Ahora necesitas un momento para ti.",
        context: "Descontrol total",
        tip: "Tiempo fuera positivo"
      },
      {
        phrase: "Tu cuerpo tiene mucha energía. Golpeemos esta almohada, no a las personas.",
        context: "Canalizar agresión",
        tip: "Alternativa segura de expresión"
      }
    ]
  },
  tdah: {
    title: "Adaptaciones para TDAH",
    description: "Frases adaptadas para niños con TDAH",
    phrases: [
      {
        phrase: "Vamos a hacer esto en pasos pequeños. Primero, ¿qué necesitamos hacer?",
        context: "Instrucciones complejas",
        tip: "Dividir en pasos"
      },
      {
        phrase: "Te voy a poner un temporizador. Cuando suene, revisamos qué lograste.",
        context: "Mantener enfoque",
        tip: "Ayudas externas de tiempo"
      },
      {
        phrase: "Parece que tu cuerpo necesita moverse. Camina dos vueltas y regresa.",
        context: "Inquietud",
        tip: "Canalizar necesidad de movimiento"
      },
      {
        phrase: "Te voy a recordar en 5 minutos. ¿Está bien?",
        context: "Olvidos frecuentes",
        tip: "Recordatorios externos"
      },
      {
        phrase: "¿Qué te ayudaría a concentrarte? ¿Música, silencio, o estar cerca de mí?",
        context: "Personalizar ambiente",
        tip: "El niño conoce sus necesidades"
      }
    ]
  }
};

// GET - Obtener todas las frases o por categoría
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category && PHRASES_DATABASE[category as keyof typeof PHRASES_DATABASE]) {
      return NextResponse.json({
        success: true,
        category: PHRASES_DATABASE[category as keyof typeof PHRASES_DATABASE]
      });
    }

    // Retornar todas las categorías con resumen
    const categories = Object.entries(PHRASES_DATABASE).map(([key, value]) => ({
      id: key,
      title: value.title,
      description: value.description,
      count: value.phrases.length
    }));

    return NextResponse.json({
      success: true,
      categories,
      allPhrases: PHRASES_DATABASE
    });
  } catch (error) {
    console.error('Error fetching phrases:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener frases' },
      { status: 500 }
    );
  }
}

// POST - Guardar frase favorita
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, phrase, category, context } = body;

    if (!userId || !phrase) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const savedPhrase = await db.savedPhrase.create({
      data: {
        userId,
        phrase,
        category: category || 'general',
        context
      }
    });

    return NextResponse.json({ success: true, savedPhrase });
  } catch (error) {
    console.error('Error saving phrase:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar frase' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar frase guardada
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phraseId = searchParams.get('id');

    if (!phraseId) {
      return NextResponse.json(
        { success: false, error: 'ID de frase requerido' },
        { status: 400 }
      );
    }

    await db.savedPhrase.delete({
      where: { id: phraseId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting phrase:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar frase' },
      { status: 500 }
    );
  }
}

export { PHRASES_DATABASE };
