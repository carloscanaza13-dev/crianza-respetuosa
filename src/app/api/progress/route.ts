import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Obtener o crear registro semanal
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const weekNumber = searchParams.get('week');
    const year = searchParams.get('year');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Si se especifica semana, obtener ese registro
    if (weekNumber && year) {
      const record = await db.weeklyRecord.findUnique({
        where: {
          userId_weekNumber_year: {
            userId,
            weekNumber: parseInt(weekNumber),
            year: parseInt(year)
          }
        }
      });

      return NextResponse.json({ success: true, record });
    }

    // Obtener todos los registros del usuario
    const records = await db.weeklyRecord.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
      take: 12
    });

    // Calcular estadísticas
    const stats = {
      totalRecords: records.length,
      avgScreamLevel: records.length > 0 
        ? (records.reduce((sum, r) => sum + r.screamLevel, 0) / records.length).toFixed(1)
        : 0,
      totalPositiveMoments: records.reduce((sum, r) => sum + r.positiveMoments, 0),
      totalChallenges: records.reduce((sum, r) => sum + r.challenges, 0),
      punishmentRate: records.length > 0
        ? ((records.filter(r => r.usedPunishment).length / records.length) * 100).toFixed(0)
        : 0
    };

    return NextResponse.json({ success: true, records, stats });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener progreso' },
      { status: 500 }
    );
  }
}

// Crear o actualizar registro semanal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      weekNumber,
      year,
      screamLevel,
      usedPunishment,
      appliedGentleLimits,
      positiveMoments,
      challenges,
      notes
    } = body;

    if (!userId || !weekNumber || !year) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar rangos
    if (screamLevel < 1 || screamLevel > 5) {
      return NextResponse.json(
        { success: false, error: 'El nivel de gritos debe estar entre 1 y 5' },
        { status: 400 }
      );
    }

    const record = await db.weeklyRecord.upsert({
      where: {
        userId_weekNumber_year: {
          userId,
          weekNumber,
          year
        }
      },
      create: {
        userId,
        weekNumber,
        year,
        screamLevel,
        usedPunishment,
        appliedGentleLimits,
        positiveMoments,
        challenges,
        notes
      },
      update: {
        screamLevel,
        usedPunishment,
        appliedGentleLimits,
        positiveMoments,
        challenges,
        notes
      }
    });

    // Registrar uso
    await db.usageLog.create({
      data: {
        userId,
        action: 'weekly_record',
        module: 'progress'
      }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar progreso' },
      { status: 500 }
    );
  }
}
