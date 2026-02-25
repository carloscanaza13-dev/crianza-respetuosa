'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  Save, 
  Volume2, 
  Ban, 
  Heart, 
  Target,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useAppStore, WeeklyRecord } from '@/store/app-store';

const chartConfig = {
  screamLevel: {
    label: "Nivel de Gritos",
    color: "hsl(var(--sage-500))",
  },
  gentleLimits: {
    label: "Límites Amables",
    color: "hsl(var(--sage-400))",
  },
} satisfies ChartConfig;

export function ProgressSection() {
  const { user, weeklyRecords, setWeeklyRecords, addWeeklyRecord } = useAppStore();
  
  // Form state
  const [screamLevel, setScreamLevel] = useState(3);
  const [usedPunishment, setUsedPunishment] = useState(false);
  const [appliedGentleLimits, setAppliedGentleLimits] = useState(0);
  const [positiveMoments, setPositiveMoments] = useState(0);
  const [challenges, setChallenges] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  };

  const currentWeek = getCurrentWeek();
  const currentYear = new Date().getFullYear();

  // Load existing records
  useEffect(() => {
    if (user?.id) {
      fetchProgress();
    }
  }, [user?.id]);

  const fetchProgress = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/progress?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setWeeklyRecords(data.records);
        
        // Check if current week record exists
        const currentRecord = data.records.find(
          (r: WeeklyRecord) => r.weekNumber === currentWeek && r.year === currentYear
        );
        
        if (currentRecord) {
          setScreamLevel(currentRecord.screamLevel);
          setUsedPunishment(currentRecord.usedPunishment);
          setAppliedGentleLimits(currentRecord.appliedGentleLimits);
          setPositiveMoments(currentRecord.positiveMoments);
          setChallenges(currentRecord.challenges);
          setNotes(currentRecord.notes || '');
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          weekNumber: currentWeek,
          year: currentYear,
          screamLevel,
          usedPunishment,
          appliedGentleLimits,
          positiveMoments,
          challenges,
          notes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addWeeklyRecord(data.record);
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Prepare chart data
  const chartData = weeklyRecords
    .slice(0, 12)
    .reverse()
    .map((record) => ({
      week: `S${record.weekNumber}`,
      screamLevel: record.screamLevel,
      gentleLimits: record.appliedGentleLimits,
      punishment: record.usedPunishment ? 1 : 0,
    }));

  // Calculate stats
  const avgScream = weeklyRecords.length > 0
    ? (weeklyRecords.reduce((sum, r) => sum + r.screamLevel, 0) / weeklyRecords.length).toFixed(1)
    : '0';
  
  const punishmentRate = weeklyRecords.length > 0
    ? ((weeklyRecords.filter(r => r.usedPunishment).length / weeklyRecords.length) * 100).toFixed(0)
    : '0';
  
  const totalPositiveMoments = weeklyRecords.reduce((sum, r) => sum + r.positiveMoments, 0);

  const getScreamLevelLabel = (level: number) => {
    const labels = ['', 'Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];
    return labels[level] || '';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Seguimiento de Progreso
        </h2>
        <p className="text-sm text-muted-foreground">
          Registra tu evolución semanal como padre/madre
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-sage-50">
            <Calendar className="h-3 w-3 mr-1" />
            Semana {currentWeek} - {currentYear}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Record Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registro Semanal</CardTitle>
              <CardDescription>
                Registra cómo te sentiste esta semana en tu rol parental
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scream Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    Nivel de gritos esta semana
                  </Label>
                  <Badge variant="outline">{getScreamLevelLabel(screamLevel)} ({screamLevel}/5)</Badge>
                </div>
                <Slider
                  value={[screamLevel]}
                  onValueChange={(value) => setScreamLevel(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  1 = Casi no grité, 5 = Grité mucho
                </p>
              </div>

              {/* Punishment */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-destructive" />
                  ¿Usaste castigos esta semana?
                </Label>
                <Switch
                  checked={usedPunishment}
                  onCheckedChange={setUsedPunishment}
                />
              </div>

              {/* Gentle Limits */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Veces que aplicaste límites firmes y amables
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={appliedGentleLimits}
                  onChange={(e) => setAppliedGentleLimits(parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Positive Moments */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Momentos positivos con tu hijo/a
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={positiveMoments}
                  onChange={(e) => setPositiveMoments(parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Challenges */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Desafíos enfrentados
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={challenges}
                  onChange={(e) => setChallenges(parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notas personales (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="¿Algo que quieras recordar de esta semana?"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="btn-primary w-full" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar Registro'}
              </Button>
              
              {lastSaved && (
                <p className="text-xs text-center text-muted-foreground">
                  Último guardado: {lastSaved}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Statistics and Charts */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{avgScream}</p>
                  <p className="text-xs text-muted-foreground">Promedio gritos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{punishmentRate}%</p>
                  <p className="text-xs text-muted-foreground">Usó castigos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{totalPositiveMoments}</p>
                  <p className="text-xs text-muted-foreground">Momentos +</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evolución del Nivel de Gritos</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis domain={[1, 5]} tickLine={false} axisLine={false} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="screamLevel"
                        stroke="var(--color-screamLevel)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-screamLevel)" }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay datos suficientes para mostrar</p>
                      <p className="text-sm">Registra tu primera semana</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gentle Limits Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Límites Amables Aplicados</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="gentleLimits"
                        fill="hsl(var(--sage-400))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <p>Registra tu primera semana para ver datos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
