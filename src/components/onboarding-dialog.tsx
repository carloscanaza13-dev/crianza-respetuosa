'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Users, Brain, Shield, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

const ageRanges = [
  '18-25 años',
  '26-35 años',
  '36-45 años',
  '46-55 años',
  '55+ años'
];

const childAgeRanges = [
  '3-4 años',
  '5-6 años',
  '7-8 años',
  '9-10 años',
  'Varios hijos de diferentes edades'
];

const countries = [
  'México',
  'Colombia',
  'Argentina',
  'Chile',
  'Perú',
  'España',
  'Ecuador',
  'Venezuela',
  'Guatemala',
  'Otro'
];

export function OnboardingDialog() {
  const { showOnboarding, setShowOnboarding, setUser } = useAppStore();
  const [step, setStep] = useState(0);
  const [ageRange, setAgeRange] = useState('');
  const [childAgeRange, setChildAgeRange] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageRange, childAgeRange, country })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Consulta Inteligente',
      description: 'Describe situaciones y recibe orientación personalizada basada en disciplina positiva.'
    },
    {
      icon: Heart,
      title: 'Módulos Psicoeducativos',
      description: 'Aprende estrategias probadas para manejar berrinches, establecer límites y más.'
    },
    {
      icon: Users,
      title: 'Biblioteca de Frases',
      description: 'Frases modelo listas para usar en situaciones específicas con tu hijo/a.'
    },
    {
      icon: Shield,
      title: 'Seguimiento de Progreso',
      description: 'Registra tu evolución semanal y visualiza tu progreso como padre/madre.'
    },
    {
      icon: Sparkles,
      title: 'Basado en Evidencia',
      description: 'Fundamentado en disciplina positiva, psicología adleriana y neurociencia.'
    }
  ];

  return (
    <Dialog open={showOnboarding} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                Asistente IA en Crianza Respetuosa
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                Herramienta psicoeducativa para padres de niños de 3 a 10 años, basada en disciplina positiva
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-6">
              {features.map((feature, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="p-2 rounded-lg bg-sage-100">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <strong>Aviso importante:</strong> Esta herramienta es psicoeducativa y no reemplaza la terapia psicológica profesional. 
              Si detectas riesgo de violencia o maltrato, por favor busca ayuda profesional.
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={() => setStep(1)} className="btn-primary px-8">
                Comenzar
              </Button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Datos opcionales para investigación</DialogTitle>
              <DialogDescription>
                Esta información nos ayuda a mejorar la herramienta y realizar estudios. 
                Todos los datos son anónimos y confidenciales.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label>Tu rango de edad</Label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu rango de edad" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRanges.map((range) => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rango de edad de tu hijo/a principal</Label>
                <Select value={childAgeRange} onValueChange={setChildAgeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el rango de edad" />
                  </SelectTrigger>
                  <SelectContent>
                    {childAgeRanges.map((range) => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>País de residencia</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(0)}>
                Atrás
              </Button>
              <Button onClick={handleCreateUser} className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Continuar'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
