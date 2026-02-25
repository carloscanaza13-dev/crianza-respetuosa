import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

// Crear o obtener usuario anónimo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, ageRange, childAgeRange, country } = body;

    // Si se proporciona un código, buscar el usuario
    if (code) {
      const existingUser = await db.anonymousUser.findUnique({
        where: { code }
      });

      if (existingUser) {
        return NextResponse.json({ 
          success: true, 
          user: existingUser,
          isNew: false 
        });
      }
    }

    // Crear nuevo usuario anónimo
    const newCode = code || `CR-${nanoid(8).toUpperCase()}`;
    
    const newUser = await db.anonymousUser.create({
      data: {
        code: newCode,
        ageRange: ageRange || null,
        childAgeRange: childAgeRange || null,
        country: country || null
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: newUser,
      isNew: true 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

// Obtener usuario por código
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Código requerido' },
        { status: 400 }
      );
    }

    const user = await db.anonymousUser.findUnique({
      where: { code },
      include: {
        consultations: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        weeklyRecords: {
          orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
          take: 12
        },
        evaluations: true,
        savedPhrases: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}
