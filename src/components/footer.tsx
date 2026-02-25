'use client';

import { Heart, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white py-3 px-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3 text-primary" />
          <span>
            Asistente IA en Crianza Respetuosa - Herramienta psicoeducativa
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-600">
          <Info className="h-3 w-3" />
          <span>
            No sustituye terapia profesional
          </span>
        </div>
      </div>
    </footer>
  );
}
