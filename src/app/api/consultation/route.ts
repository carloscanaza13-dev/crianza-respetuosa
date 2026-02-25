import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateConsultationResponse } from '@/lib/ai-system';

// Procesar consulta con IA
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, situation, conversationHistory } = body;

    if (!situation || situation.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'La descripción de la situación es requerida' },
        { status: 400 }
      );
    }

    // Verificar si la situación indica posible riesgo
    const riskKeywords = ['golpeo', 'golpear', 'lastimar', 'lastimo', 'maltrato', 'abuso', 'herir', 'marcas', 'moretones'];
    const hasRisk = riskKeywords.some(keyword => 
      situation.toLowerCase().includes(keyword)
    );

    // Generar respuesta con IA
    const { response, category } = await generateConsultationResponse(
      situation,
      conversationHistory || []
    );

    // Si hay usuario, guardar la consulta
    let consultation = null;
    if (userId) {
      consultation = await db.consultation.create({
        data: {
          userId,
          situation,
          response,
          category
        }
      });

      // Registrar uso
      await db.usageLog.create({
        data: {
          userId,
          action: 'consultation',
          module: category
        }
      });
    }

    return NextResponse.json({
      success: true,
      response,
      category,
      consultationId: consultation?.id,
      riskWarning: hasRisk ? 'Si sientes que podrías lastimar a tu hijo/a, te urge buscar ayuda profesional. Esta herramienta es solo psicoeducativa.' : null
    });
  } catch (error) {
    console.error('Error in consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la consulta' },
      { status: 500 }
    );
  }
}

// Obtener historial de consultas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const consultations = await db.consultation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json({ success: true, consultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener historial' },
      { status: 500 }
    );
  }
}

// Marcar consulta como útil/no útil
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { consultationId, helpful } = body;

    if (!consultationId) {
      return NextResponse.json(
        { success: false, error: 'ID de consulta requerido' },
        { status: 400 }
      );
    }

    const consultation = await db.consultation.update({
      where: { id: consultationId },
      data: { helpful }
    });

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar consulta' },
      { status: 500 }
    );
  }
}
