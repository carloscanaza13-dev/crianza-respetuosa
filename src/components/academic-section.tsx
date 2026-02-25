'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  GraduationCap, 
  Download, 
  FileSpreadsheet, 
  BookOpen,
  Brain,
  Users,
  Heart,
  Shield,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';

const theoreticalFoundations = [
  {
    title: "Disciplina Positiva",
    author: "Jane Nelsen",
    description: "Modelo educativo que enseña habilidades para la vida y fomenta el desarrollo de autorregulación mediante límites firmes Y amables.",
    keyPrinciples: [
      "Los niños buscan pertenencia y significado",
      "La conducta inadecuada es un código erróneo",
      "Los niños necesitan estímulos para desarrollar sus capacidades",
      "Las consecuencias lógicas enseñan mejor que los castigos",
      "La conexión antes que la corrección"
    ],
    icon: Heart,
    color: "bg-rose-100 text-rose-600"
  },
  {
    title: "Psicología Adleriana",
    author: "Alfred Adler",
    description: "Enfoque que entiende el comportamiento humano como orientado hacia una meta de pertenencia y contribución al grupo social.",
    keyPrinciples: [
      "El comportamiento es holístico y orientado a metas",
      "Los seres humanos son seres sociales por naturaleza",
      "El ser humano es un agente activo que elige su comportamiento",
      "Las metas erróneas del comportamiento infantil: atención, poder, venganza, evitación",
      "Importancia del sentido de comunidad"
    ],
    icon: Users,
    color: "bg-violet-100 text-violet-600"
  },
  {
    title: "Neurociencia del Desarrollo",
    author: "Daniel Siegel, Tina Payne Bryson",
    description: "Comprensión del cerebro en desarrollo que explica la necesidad de co-regulación y las limitaciones del control emocional infantil.",
    keyPrinciples: [
      "El cerebro no termina su desarrollo hasta los 25 años",
      "La corteza prefrontal (razonamiento) se desarrolla último",
      "El cerebro inferior (emociones) predomina en la infancia",
      "La co-regulación es necesaria antes de la autorregulación",
      "El estrés tóxico afecta el desarrollo cerebral"
    ],
    icon: Brain,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Terapia Cognitivo-Conductual",
    author: "Aaron Beck",
    description: "Aplicación de principios de reestructuración cognitiva para ayudar a los padres a identificar y modificar pensamientos disfuncionales.",
    keyPrinciples: [
      "Los pensamientos influyen en las emociones y conductas",
      "Identificación de distorsiones cognitivas parentales",
      "Reemplazo de pensamientos automáticos negativos",
      "Expectativas realistas vs expectativas perfeccionistas",
      "Manejo de estrés y activación conductual"
    ],
    icon: Shield,
    color: "bg-emerald-100 text-emerald-600"
  }
];

const evaluationScales = [
  { id: 'knowledge', label: 'Conocimiento sobre crianza respetuosa', description: '¿Qué tanto sabes sobre disciplina positiva?' },
  { id: 'confidence', label: 'Confianza en establecer límites', description: '¿Qué tan seguro/a te sientes al poner límites?' },
  { id: 'emotional', label: 'Capacidad de regulación emocional', description: '¿Qué tan bien manejas tus emociones difíciles?' },
  { id: 'communication', label: 'Calidad de comunicación con tu hijo/a', description: '¿Qué tan efectiva es tu comunicación?' },
  { id: 'satisfaction', label: 'Satisfacción general con la crianza', description: '¿Qué tan satisfecho/a estás con tu rol parental?' },
  { id: 'stress', label: 'Nivel de estrés parental', description: '¿Qué nivel de estrés experimentas como padre/madre?' },
  { id: 'support', label: 'Red de apoyo percibida', description: '¿Qué tan apoyado/a te sientes?' }
];

export function AcademicSection() {
  const { user } = useAppStore();
  const [evaluationType, setEvaluationType] = useState<'pre' | 'post'>('pre');
  const [scales, setScales] = useState<Record<string, number>>({
    knowledge: 3,
    confidence: 3,
    emotional: 3,
    communication: 3,
    satisfaction: 3,
    stress: 3,
    support: 3
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedType, setSavedType] = useState<string | null>(null);

  const handleScaleChange = (id: string, value: number) => {
    setScales(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveEvaluation = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: evaluationType,
          knowledgeLevel: scales.knowledge,
          confidenceLevel: scales.confidence,
          emotionalRegulation: scales.emotional,
          communicationQuality: scales.communication,
          overallSatisfaction: scales.satisfaction,
          stressLevel: scales.stress,
          supportNetwork: scales.support
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSavedType(evaluationType);
      }
    } catch (error) {
      console.error('Error saving evaluation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async (format: 'json' | 'csv') => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/export?userId=${user.id}&format=${format}`);
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `datos_crianza_${user.code}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `datos_crianza_${user.code}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Sección Académica
        </h2>
        <p className="text-sm text-muted-foreground">
          Fundamento teórico y herramientas para investigación
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Theoretical Foundations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Fundamento Teórico
              </CardTitle>
              <CardDescription>
                Esta aplicación se basa en modelos teóricos respaldados por evidencia científica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {theoreticalFoundations.map((foundation, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${foundation.color}`}>
                          <foundation.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{foundation.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{foundation.author}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{foundation.description}</p>
                      <div className="space-y-1">
                        {foundation.keyPrinciples.slice(0, 3).map((principle, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            {principle}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pre/Post Evaluation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Evaluación Pre/Post Intervención
              </CardTitle>
              <CardDescription>
                Escalas de medición para estudios cuasi-experimentales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button
                  variant={evaluationType === 'pre' ? 'default' : 'outline'}
                  className={evaluationType === 'pre' ? 'btn-primary' : ''}
                  onClick={() => setEvaluationType('pre')}
                >
                  Evaluación Pre
                </Button>
                <Button
                  variant={evaluationType === 'post' ? 'default' : 'outline'}
                  className={evaluationType === 'post' ? 'btn-primary' : ''}
                  onClick={() => setEvaluationType('post')}
                >
                  Evaluación Post
                </Button>
              </div>

              <div className="space-y-6">
                {evaluationScales.map((scale) => (
                  <div key={scale.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">{scale.label}</Label>
                        <p className="text-xs text-muted-foreground">{scale.description}</p>
                      </div>
                      <Badge variant="outline">{scales[scale.id]}/5</Badge>
                    </div>
                    <Slider
                      value={[scales[scale.id]]}
                      onValueChange={(value) => handleScaleChange(scale.id, value[0])}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveEvaluation} className="btn-primary w-full" disabled={isSaving}>
                {isSaving ? 'Guardando...' : `Guardar Evaluación ${evaluationType === 'pre' ? 'Inicial' : 'Final'}`}
              </Button>

              {savedType === evaluationType && (
                <div className="flex items-center gap-2 text-primary text-sm justify-center">
                  <CheckCircle className="h-4 w-4" />
                  Evaluación guardada correctamente
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Exportación de Datos
              </CardTitle>
              <CardDescription>
                Descarga tus datos para análisis o compartir con tu terapeuta/investigador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-sage-50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Tus datos incluyen:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Código participante anónimo</li>
                  <li>• Evaluaciones pre y post</li>
                  <li>• Registros semanales de progreso</li>
                  <li>• Estadísticas de uso de la aplicación</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleExportData('json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar JSON
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleExportData('csv')}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ethics Notice */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Aviso Ético</p>
                  <p>
                    Esta aplicación es una herramienta psicoeducativa y no sustituye la terapia psicológica profesional. 
                    Los datos recolectados son anónimos y se utilizan únicamente para investigación académica 
                    y mejora de la herramienta. Si detectas situaciones de violencia o riesgo, por favor 
                    contacta a un profesional de salud mental.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
