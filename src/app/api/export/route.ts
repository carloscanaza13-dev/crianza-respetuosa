import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Exportar datos del usuario para investigación
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'json'; // 'json', 'csv'

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Obtener todos los datos del usuario
    const user = await db.anonymousUser.findUnique({
      where: { id: userId },
      include: {
        consultations: {
          orderBy: { createdAt: 'asc' }
        },
        weeklyRecords: {
          orderBy: [{ year: 'asc' }, { weekNumber: 'asc' }]
        },
        evaluations: true,
        savedPhrases: true,
        _count: {
          select: {
            consultations: true,
            weeklyRecords: true,
            savedPhrases: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para exportación (anonimizados)
    const exportData = {
      participantCode: user.code,
      demographics: {
        ageRange: user.ageRange,
        childAgeRange: user.childAgeRange,
        country: user.country
      },
      registrationDate: user.createdAt.toISOString(),
      evaluations: user.evaluations.map(e => ({
        type: e.type,
        knowledgeLevel: e.knowledgeLevel,
        confidenceLevel: e.confidenceLevel,
        emotionalRegulation: e.emotionalRegulation,
        communicationQuality: e.communicationQuality,
        overallSatisfaction: e.overallSatisfaction,
        stressLevel: e.stressLevel,
        supportNetwork: e.supportNetwork,
        date: e.createdAt.toISOString()
      })),
      weeklyProgress: user.weeklyRecords.map(r => ({
        week: r.weekNumber,
        year: r.year,
        screamLevel: r.screamLevel,
        usedPunishment: r.usedPunishment ? 1 : 0,
        appliedGentleLimits: r.appliedGentleLimits,
        positiveMoments: r.positiveMoments,
        challenges: r.challenges
      })),
      consultationStats: {
        total: user._count.consultations,
        categories: {} as Record<string, number>
      }
    };

    // Contar categorías de consultas
    user.consultations.forEach(c => {
      if (c.category) {
        exportData.consultationStats.categories[c.category] = 
          (exportData.consultationStats.categories[c.category] || 0) + 1;
      }
    });

    if (format === 'csv') {
      // Generar CSV
      const csvRows: string[] = [];
      
      // Header
      csvRows.push('codigo_participante,fecha_registro,rango_edad,rango_edad_hijo,pais');
      csvRows.push(`${user.code},${user.createdAt.toISOString()},${user.ageRange || ''},${user.childAgeRange || ''},${user.country || ''}`);
      csvRows.push('');
      
      // Evaluaciones
      csvRows.push('=== EVALUACIONES ===');
      csvRows.push('tipo,conocimiento,confianza,regulacion_emocional,comunicacion,satisfaccion,estres,red_apoyo,fecha');
      user.evaluations.forEach(e => {
        csvRows.push(`${e.type},${e.knowledgeLevel},${e.confidenceLevel},${e.emotionalRegulation},${e.communicationQuality},${e.overallSatisfaction},${e.stressLevel},${e.supportNetwork},${e.createdAt.toISOString()}`);
      });
      csvRows.push('');
      
      // Progreso semanal
      csvRows.push('=== PROGRESO SEMANAL ===');
      csvRows.push('semana,año,nivel_gritos,uso_castigos,limites_amables,momentos_positivos,desafios');
      user.weeklyRecords.forEach(r => {
        csvRows.push(`${r.weekNumber},${r.year},${r.screamLevel},${r.usedPunishment ? 1 : 0},${r.appliedGentleLimits},${r.positiveMoments},${r.challenges}`);
      });

      const csv = csvRows.join('\n');
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="datos_crianza_${user.code}.csv"`
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: exportData,
      exportDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { success: false, error: 'Error al exportar datos' },
      { status: 500 }
    );
  }
}
