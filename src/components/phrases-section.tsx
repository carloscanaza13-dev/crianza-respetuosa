'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Quote, 
  Copy, 
  Check, 
  Heart,
  Flame,
  Users,
  Monitor,
  BookOpen,
  Moon,
  AlertTriangle,
  Activity,
  ChevronRight
} from 'lucide-react';

interface Phrase {
  phrase: string;
  context: string;
  tip: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const categories: Category[] = [
  { id: 'berrinches', title: 'Berrinches', description: 'Momentos de descontrol emocional', count: 5, icon: Flame, color: 'bg-orange-100 text-orange-600' },
  { id: 'desobediencia', title: 'Desobediencia', description: 'Cuando no sigue instrucciones', count: 5, icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
  { id: 'hermanos', title: 'Peleas entre Hermanos', description: 'Conflictos fraternos', count: 5, icon: Users, color: 'bg-violet-100 text-violet-600' },
  { id: 'pantallas', title: 'Uso de Pantallas', description: 'Tecnología y límites', count: 5, icon: Monitor, color: 'bg-blue-100 text-blue-600' },
  { id: 'tareas', title: 'Tareas Escolares', description: 'Deberes y estudio', count: 5, icon: BookOpen, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'dormir', title: 'Problemas para Dormir', description: 'Rutina nocturna', count: 5, icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'agresividad', title: 'Conductas Agresivas', description: 'Golpes y agresión', count: 5, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  { id: 'tdah', title: 'Adaptaciones TDAH', description: 'Para niños con TDAH', count: 5, icon: Activity, color: 'bg-teal-100 text-teal-600' },
];

// Frases embebidas para no depender de API
const phrasesData: Record<string, Phrase[]> = {
  berrinches: [
    { phrase: "Veo que estás muy molesto/a. Es difícil cuando no podemos tener lo que queremos.", context: "Cuando el niño llora por algo que no puede tener", tip: "Valida la emoción antes de redirigir" },
    { phrase: "Tus sentimientos son muy grandes ahora. Estoy aquí contigo.", context: "Durante el berrinche", tip: "Presencia tranquila sin intentar 'arreglar'" },
    { phrase: "Cuando estés listo/a para hablar, yo estaré aquí esperándote.", context: "Cuando el niño está gritando", tip: "Ofrece espacio sin abandonar" },
    { phrase: "Tu cuerpo necesita calmarse. ¿Quieres un abrazo o prefieres espacio?", context: "Ofreciendo opciones de regulación", tip: "El niño elige cómo regularse" },
    { phrase: "Entiendo que querías ese juguete. No se puede comprar hoy, y está bien que te sientas triste.", context: "En tienda o lugar público", tip: "Límite claro + validación" }
  ],
  desobediencia: [
    { phrase: "Sé que quieres seguir jugando. Es hora de cenar. ¿Prefieres lavarte las manos tú o te ayudo?", context: "Transiciones difíciles", tip: "Ofrece elección dentro del límite" },
    { phrase: "La pregunta no es si vas a bañarte, es cuándo. ¿Ahora o en 5 minutos?", context: "Cuando se niega a cooperar", tip: "Límite firme con autonomía limitada" },
    { phrase: "Te escucho diciendo que no quieres. Entiendo. Esto necesita hacerse. ¿Cómo te gustaría hacerlo?", context: "Negativa constante", tip: "Valida + mantén expectativa + ofrece flexibilidad" },
    { phrase: "Cuando digas 'no' a limpiar, los juguetes descansan en la caja hasta mañana.", context: "Consecuencia lógica", tip: "Consecuencia relacionada, no castigo" },
    { phrase: "Parece que necesitas ayuda. Vamos a hacerlo juntos.", context: "Cuando hay resistencia", tip: "Conexión antes que corrección" }
  ],
  hermanos: [
    { phrase: "Veo dos niños que tienen un problema. ¿Quieren ayuda para resolverlo o lo resuelven ustedes?", context: "Inicio de conflicto", tip: "Fomenta autonomía, ofrece apoyo" },
    { phrase: "Aquí no se golpea. Vamos a separarnos un momento y luego hablamos.", context: "Conflicto físico", tip: "Seguridad primero, luego enseñanza" },
    { phrase: "Cada uno me cuenta su versión sin interrumpir. Tú primero, luego tú.", context: "Ambos quieren hablar", tip: "Estructura para escucha" },
    { phrase: "Este juguete es para compartir. Si no pueden compartirlo, lo guardo por ahora.", context: "Disputa por objeto", tip: "Consecuencia lógica neutral" },
    { phrase: "¿Qué solución se les ocurre que funcione para los dos?", context: "Buscando resolución", tip: "Desarrolla resolución de problemas" }
  ],
  pantallas: [
    { phrase: "El tiempo de pantalla terminó. ¿Quieres apagar tú o lo hago yo?", context: "Fin del tiempo permitido", tip: "Elección dentro del límite" },
    { phrase: "Sé que es difícil apagar. El cerebro quiere seguir. Es hora de hacer otra cosa.", context: "Resistencia al cambio", tip: "Normaliza la dificultad + mantén límite" },
    { phrase: "Las pantallas descansan después de cenar. Esa es la regla de nuestra familia.", context: "Regla clara establecida", tip: "Reglas consistentes sin negociación" },
    { phrase: "Tu cuerpo necesita moverse. ¿Qué prefieres hacer: saltar o dibujar?", context: "Ofrecer alternativas activas", tip: "Transición a actividad física" },
    { phrase: "Aprecio cómo apagaste sin quejarte. Eso muestra madurez.", context: "Después de cooperar", tip: "Refuerza comportamiento positivo" }
  ],
  tareas: [
    { phrase: "Veo que la tarea es difícil. ¿Qué parte te cuesta más? Vamos a revisarla juntos.", context: "Frustración con tarea", tip: "Identifica obstáculo específico" },
    { phrase: "¿Cuánto tiempo necesitas? ¿30 minutos o 45?", context: "Planificación", tip: "Estimación y compromiso" },
    { phrase: "Primero terminamos la tarea, luego puedes jugar. ¿Por cuál tarea empiezas?", context: "Secuencia clara", tip: "Primero/luego + elección" },
    { phrase: "No necesitas hacerlo perfecto. Necesitas hacerlo.", context: "Perfeccionismo", tip: "Reduce presión" },
    { phrase: "Tómate un descanso de 5 minutos. Cuando regreses, continuamos.", context: "Sobrecarga", tip: "Pausas estructuradas" }
  ],
  dormir: [
    { phrase: "Tu cuerpo necesita descansar para tener energía mañana. Es hora de dormir.", context: "Se niega a dormir", tip: "Explicación simple del por qué" },
    { phrase: "Puedo leerte un cuento o cantarte una canción. ¿Cuál prefieres?", context: "Rutina nocturna", tip: "Elección dentro de la rutina" },
    { phrase: "Sé que no quieres dormir. Es hora de dormir. Estaré cerca si me necesitas.", context: "Resistencia con miedo", tip: "Valida + límite + disponibilidad" },
    { phrase: "Un vaso de agua, un beso, y luego a dormir. Esas son las reglas de noche.", context: "Peticiones repetidas", tip: "Reglas claras y consistentes" },
    { phrase: "Tu muñeco también tiene sueño. Vamos a acostarlo contigo.", context: "Usar transición suave", tip: "Acompañamiento simbólico" }
  ],
  agresividad: [
    { phrase: "Aquí no se golpea. Me voy a asegurar de que todos estén seguros.", context: "Golpea a otros", tip: "Seguridad inmediata sin sermones" },
    { phrase: "Estás muy enojado/a. Golpear no está permitido. ¿Qué necesitas expresar?", context: "Después de golpear", tip: "Valida emoción + límite + alternativas" },
    { phrase: "Las palabras pueden lastimar. En esta familia nos hablamos con respeto.", context: "Insultos o groserías", tip: "Límite sobre comunicación" },
    { phrase: "Cuando estés calmado/a podemos hablar. Ahora necesitas un momento para ti.", context: "Descontrol total", tip: "Tiempo fuera positivo" },
    { phrase: "Tu cuerpo tiene mucha energía. Golpeemos esta almohada, no a las personas.", context: "Canalizar agresión", tip: "Alternativa segura de expresión" }
  ],
  tdah: [
    { phrase: "Vamos a hacer esto en pasos pequeños. Primero, ¿qué necesitamos hacer?", context: "Instrucciones complejas", tip: "Dividir en pasos" },
    { phrase: "Te voy a poner un temporizador. Cuando suene, revisamos qué lograste.", context: "Mantener enfoque", tip: "Ayudas externas de tiempo" },
    { phrase: "Parece que tu cuerpo necesita moverse. Camina dos vueltas y regresa.", context: "Inquietud", tip: "Canalizar necesidad de movimiento" },
    { phrase: "Te voy a recordar en 5 minutos. ¿Está bien?", context: "Olvidos frecuentes", tip: "Recordatorios externos" },
    { phrase: "¿Qué te ayudaría a concentrarte? ¿Música, silencio, o estar cerca de mí?", context: "Personalizar ambiente", tip: "El niño conoce sus necesidades" }
  ]
};

export function PhrasesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('berrinches');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentPhrases = phrasesData[selectedCategory] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Quote className="h-5 w-5 text-primary" />
          Biblioteca de Frases Modelo
        </h2>
        <p className="text-sm text-muted-foreground">
          Frases listas para usar en situaciones específicas
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Categories */}
        <div className="md:w-64 border-b md:border-b-0 md:border-r bg-sage-50/30">
          <ScrollArea className="h-full">
            <div className="p-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-start mb-1 h-auto py-2 px-3 ${
                    selectedCategory === category.id ? 'bg-sage-100' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{category.title}</p>
                      <p className="text-xs text-muted-foreground">{category.count} frases</p>
                    </div>
                    {selectedCategory === category.id && (
                      <ChevronRight className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Phrases */}
        <ScrollArea className="flex-1 p-4">
          {currentCategory && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{currentCategory.title}</h3>
              <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
            </div>
          )}

          <div className="space-y-4">
            {currentPhrases.map((phrase, index) => (
              <Card key={index} className="phrase-card card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-sage-100">
                      <Quote className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-base mb-2">"{phrase.phrase}"</p>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline" className="text-xs">
                          {phrase.context}
                        </Badge>
                      </div>
                      <div className="bg-sage-50 rounded-lg p-2 text-sm">
                        <strong>Tip:</strong> {phrase.tip}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(phrase.phrase, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
