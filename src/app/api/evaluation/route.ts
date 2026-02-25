import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Obtener evaluaciones del usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'pre' o 'post'

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    if (type) {
      const evaluation = await db.evaluation.findUnique({
        where: {
          userId_type: { userId, type }
        }
      });

      return NextResponse.json({ success: true, evaluation });
    }

    const evaluations = await db.evaluation.findMany({
      where: { userId }
    });

    return NextResponse.json({ success: true, evaluations });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener evaluaciones' },
      { status: 500 }
    );
  }
}

// Crear o actualizar evaluación
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      type, // 'pre' o 'post'
      knowledgeLevel,
      confidenceLevel,
      emotionalRegulation,
      communicationQuality,
      overallSatisfaction,
      stressLevel,
      supportNetwork,
      notes
    } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    if (!['pre', 'post'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'El tipo debe ser "pre" o "post"' },
        { status: 400 }
      );
    }

    // Validar rangos (1-5)
    const scales = [knowledgeLevel, confidenceLevel, emotionalRegulation, communicationQuality, overallSatisfaction, stressLevel, supportNetwork];
    if (scales.some(s => s !== undefined && (s < 1 || s > 5))) {
      return NextResponse.json(
        { success: false, error: 'Todas las escalas deben estar entre 1 y 5' },
        { status: 400 }
      );
    }

    const evaluation = await db.evaluation.upsert({
      where: {
        userId_type: { userId, type }
      },
      create: {
        userId,
        type,
        knowledgeLevel: knowledgeLevel || 3,
        confidenceLevel: confidenceLevel || 3,
        emotionalRegulation: emotionalRegulation || 3,
        communicationQuality: communicationQuality || 3,
        overallSatisfaction: overallSatisfaction || 3,
        stressLevel: stressLevel || 3,
        supportNetwork: supportNetwork || 3,
        notes
      },
      update: {
        knowledgeLevel,
        confidenceLevel,
        emotionalRegulation,
        communicationQuality,
        overallSatisfaction,
        stressLevel,
        supportNetwork,
        notes
      }
    });

    // Registrar uso
    await db.usageLog.create({
      data: {
        userId,
        action: 'evaluation',
        module: type
      }
    });

    return NextResponse.json({ success: true, evaluation });
  } catch (error) {
    console.error('Error saving evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar evaluación' },
      { status: 500 }
    );
  }
}
