'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  Flame, 
  Shield, 
  Scale, 
  Heart, 
  Activity,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  content: {
    intro: string;
    keyPoints: string[];
    strategies: { title: string; description: string }[];
    avoid: string[];
    remember: string;
  };
}

const modules: Module[] = [
  {
    id: 'comportamiento',
    title: 'Comprensión del Comportamiento Infantil',
    description: 'Entiende por qué los niños actúan como actúan',
    icon: Brain,
    color: 'bg-violet-100 text-violet-600',
    content: {
      intro: 'Todo comportamiento tiene un propósito. Según la psicología adleriana, los niños buscan pertenencia y contribución. Cuando no logran esto de forma positiva, recurren a metas erróneas.',
      keyPoints: [
        'El cerebro infantil no está completamente desarrollado hasta los 25 años',
        'Las conexiones neuronales se fortalecen con la repetición',
        'El estrés activa respuestas de lucha, huida o congelación',
        'Los niños no nos "hacen enojar", nosotros elegimos cómo reaccionar'
      ],
      strategies: [
        { title: 'Observa sin juzgar', description: 'Antes de reaccionar, pregúntate: ¿Qué necesita mi hijo en este momento?' },
        { title: 'Conecta antes de corregir', description: 'Un niño que se siente conectado coopera más' },
        { title: 'Busca el propósito', description: '¿Busca atención? ¿Poder? ¿Venganza? ¿Se siente inadecuado?' }
      ],
      avoid: [
        'Interpretar malicia donde hay falta de habilidad',
        'Esperar control emocional adulto en un niño',
        'Tomar el comportamiento como algo personal'
      ],
      remember: 'Un niño que "actúa mal" es un niño que necesita ayuda, no castigo.'
    }
  },
  {
    id: 'berrinches',
    title: 'Manejo de Berrinches',
    description: 'Estrategias para momentos de descontrol emocional',
    icon: Flame,
    color: 'bg-orange-100 text-orange-600',
    content: {
      intro: 'Los berrinches son normales en el desarrollo. Ocurren cuando el sistema nervioso del niño se sobrecarga. No son manipulación, son desregulación.',
      keyPoints: [
        'Los berrinches son más comunes entre 2-4 años',
        'Duración promedio: 3-5 minutos (aunque parecen horas)',
        'El 75% de berrinches ocurren cuando el niño está cansado o hambriento',
        'Un niño en berrinche no puede razonar - su cerebro racional está "apagado"'
      ],
      strategies: [
        { title: 'Mantén la calma', description: 'Tu regulación emocional es el modelo que el niño aprende' },
        { title: 'Presencia segura', description: 'Quédate cerca sin intentar "arreglar" inmediatamente' },
        { title: 'Valida sin ceder', description: '"Veo que estás muy molesto. No puedes tener el dulce, y está bien que estés enojado"' },
        { title: 'Ofrece opciones de regulación', description: '¿Quieres un abrazo? ¿Prefieres estar solo un momento?' }
      ],
      avoid: [
        'Tratar de razonar durante el berrinche',
        'Ceder para que pare de llorar',
        'Regañar o amenazar',
        'Ignorar completamente al niño'
      ],
      remember: 'Tu objetivo no es detener el berrinche, sino acompañar al niño mientras aprende a regularse.'
    }
  },
  {
    id: 'limites',
    title: 'Límites Firmes y Amables',
    description: 'Cómo establecer reglas sin ser autoritario ni permisivo',
    icon: Shield,
    color: 'bg-emerald-100 text-emerald-600',
    content: {
      intro: 'Los límites firmes Y amables son el corazón de la disciplina positiva. Firmes porque respetan las necesidades del adulto y la situación. Amables porque respetan la dignidad del niño.',
      keyPoints: [
        'Los niños NECESITAN límites para sentirse seguros',
        'Un límite claro reduce la ansiedad infantil',
        'La consistencia es más importante que la severidad',
        'Los límites enseñan, los castigos dañan'
      ],
      strategies: [
        { title: 'Formula límites positivos', description: 'En lugar de "no corras", di "camina despacio"' },
        { title: 'Ofrece elección dentro del límite', description: '"Es hora de bañarte. ¿Quieres entrar tú o te ayudo?"' },
        { title: 'Usa "primero... luego..."', description: '"Primero terminamos la cena, luego puedes jugar"' },
        { title: 'Sé breve y específico', description: 'Las explicaciones largas diluyen el mensaje' }
      ],
      avoid: [
        'Decir "no" a todo',
        'Cambiar las reglas según tu estado de ánimo',
        'Amenazar sin cumplir',
        'Pedir permiso para poner un límite'
      ],
      remember: 'Un límite sin empatía es autoritarismo. Empatía sin límite es permisividad. Necesitamos ambos.'
    }
  },
  {
    id: 'consecuencias',
    title: 'Consecuencias Lógicas vs Castigos',
    description: 'La diferencia que cambia todo',
    icon: Scale,
    color: 'bg-blue-100 text-blue-600',
    content: {
      intro: 'Las consecuencias lógicas enseñan responsabilidad. Los castigos generan resentimiento. La diferencia está en la conexión entre la acción y el resultado.',
      keyPoints: [
        'Consecuencia lógica: Relacionada, respetuosa, razonable, revelada de antemano',
        'Castigo: Impone sufrimiento para "enseñar una lección"',
        'Las consecuencias naturales ocurren sin intervención',
        'Las consecuencias lógicas son creadas por el adulto con propósito educativo'
      ],
      strategies: [
        { title: 'Conexión lógica', description: 'Si no comes la cena, no hay postre (no "vas a tu cuarto")' },
        { title: 'Opciones anticipadas', description: '"Si tiras los juguetes, se guardan por hoy. Tú decides."' },
        { title: 'Reparación', description: '"Rompiste el juguete de tu hermano. ¿Cómo podemos arreglarlo?"' },
        { title: 'Pérdida de privilegio', description: 'Relacionado: Si maltratas el iPad, no lo usas esta semana' }
      ],
      avoid: [
        'Usar consecuencias disfrazadas de castigo',
        'Aplicar consecuencias en caliente',
        'Consecuencias excesivas que el niño no pueda cumplir',
        'Consecuencias no relacionadas (si pegas, no hay tele)'
      ],
      remember: 'Pregúntate: ¿Esto enseña una habilidad o genera miedo? Si genera miedo, es castigo.'
    }
  },
  {
    id: 'regulacion',
    title: 'Regulación Emocional Parental',
    description: 'Primero tú, luego tu hijo',
    icon: Heart,
    color: 'bg-rose-100 text-rose-600',
    content: {
      intro: 'No puedes enseñar lo que no puedes hacer. Los niños aprenden regulación emocional co-regulándose con adultos tranquilos. Tu sistema nervioso influye directamente en el de tu hijo.',
      keyPoints: [
        'El 90% de la comunicación es no verbal',
        'Los padres estresados tienen hijos más estresados',
        'La capacidad de autorregulación se desarrolla con práctica',
        'Pedir tiempo para calmarse es modelar autocuidado'
      ],
      strategies: [
        { title: 'Pausa consciente', description: 'Respira 3 veces antes de responder a un comportamiento difícil' },
        { title: 'Detecta tus disparadores', description: '¿Qué conductas de tu hijo te activan más? ¿Por qué?' },
        { title: 'Ritual de transición', description: '2 minutos de respiración antes de llegar a casa' },
        { title: 'Red de apoyo', description: 'Identifica a quién puedes llamar cuando estás al límite' }
      ],
      avoid: [
        'Ignorar señales de burnout parental',
        'Tratar de ser perfecto/a',
        'Suprimir emociones "negativas"',
        'Sentir culpa por cada error'
      ],
      remember: 'Un padre que se perdona a sí mismo modela la auto-compasión más poderosa.'
    }
  },
  {
    id: 'tdah',
    title: 'Adaptaciones para TDAH',
    description: 'Estrategias específicas para niños con TDAH',
    icon: Activity,
    color: 'bg-amber-100 text-amber-600',
    content: {
      intro: 'Los niños con TDAH tienen un desarrollo ejecutivo diferente. No es mala conducta, es un cerebro que funciona de manera distinta. Las estrategias estándar necesitan adaptaciones.',
      keyPoints: [
        'El TDAH no es falta de disciplina, es una condición neurobiológica',
        'La función ejecutiva puede tener un retraso de 30% respecto a la edad cronológica',
        'La dopamina se procesa diferente - la motivación funciona distinto',
        'Lo que funciona hoy puede no funcionar mañana'
      ],
      strategies: [
        { title: 'Instrucciones en trozos', description: 'Una instrucción a la vez. Verifica comprensión.' },
        { title: 'Ayudas visuales', description: 'Rutinas en imágenes, temporizadores visibles, checklists' },
        { title: 'Movimiento permitido', description: 'El niño con TDAH necesita moverse para concentrarse' },
        { title: 'Transiciones anunciadas', description: '"En 5 minutos... en 2 minutos... en 1 minuto..."' },
        { title: 'Refuerzo inmediato', description: 'Las consecuencias demoradas no funcionan igual' }
      ],
      avoid: [
        'Esperar que "se esfuerce más"',
        'Usar consequencias lejanas en el tiempo',
        'Comparar con hermanos sin TDAH',
        'Largas explicaciones o sermones'
      ],
      remember: 'El TDAH no es una excusa, es una explicación. Con las adaptaciones correctas, estos niños pueden prosperar.'
    }
  }
];

export function ModulesSection() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  const markComplete = (id: string) => {
    if (completedModules.includes(id)) {
      setCompletedModules(completedModules.filter(m => m !== id));
    } else {
      setCompletedModules([...completedModules, id]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Módulos Psicoeducativos
        </h2>
        <p className="text-sm text-muted-foreground">
          Aprende estrategias basadas en evidencia para la crianza respetuosa
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-sage-50">
            {completedModules.length} de {modules.length} completados
          </Badge>
        </div>
      </div>

      {/* Modules List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden card-hover">
              <Collapsible
                open={expandedModule === module.id}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-sage-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${module.color}`}>
                          <module.icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedModules.includes(module.id) && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                        {expandedModule === module.id ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    {/* Introduction */}
                    <div className="bg-sage-50 rounded-lg p-4">
                      <p className="text-sm leading-relaxed">{module.content.intro}</p>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Puntos Clave
                      </h4>
                      <ul className="space-y-2">
                        {module.content.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strategies */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Estrategias Prácticas
                      </h4>
                      <div className="space-y-3">
                        {module.content.strategies.map((strategy, idx) => (
                          <div key={idx} className="bg-white border rounded-lg p-3">
                            <p className="font-medium text-sm">{strategy.title}</p>
                            <p className="text-sm text-muted-foreground">{strategy.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What to avoid */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        Qué Evitar
                      </h4>
                      <ul className="space-y-2">
                        {module.content.avoid.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-destructive/80">
                            <span className="mt-1">✗</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Remember */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-amber-800">
                        💡 Recuerda: {module.content.remember}
                      </p>
                    </div>

                    {/* Complete button */}
                    <Button
                      onClick={() => markComplete(module.id)}
                      variant={completedModules.includes(module.id) ? "default" : "outline"}
                      className={completedModules.includes(module.id) ? "btn-primary" : ""}
                    >
                      {completedModules.includes(module.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Módulo Completado
                        </>
                      ) : (
                        'Marcar como Completado'
                      )}
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
