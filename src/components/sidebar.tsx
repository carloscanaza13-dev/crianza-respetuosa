'use client';

import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  MessageCircle, 
  BookOpen, 
  Quote, 
  TrendingUp, 
  GraduationCap,
  Menu,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'consultation' as const, label: 'Consulta IA', icon: MessageCircle },
  { id: 'modules' as const, label: 'Módulos', icon: BookOpen },
  { id: 'phrases' as const, label: 'Frases', icon: Quote },
  { id: 'progress' as const, label: 'Progreso', icon: TrendingUp },
  { id: 'academic' as const, label: 'Académico', icon: GraduationCap },
];

interface NavContentProps {
  currentSection: string;
  setSection: (section: 'consultation' | 'modules' | 'phrases' | 'progress' | 'academic') => void;
  setSidebarOpen: (open: boolean) => void;
  userCode: string | undefined;
}

function NavContent({ currentSection, setSection, setSidebarOpen, userCode }: NavContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sage-500">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Crianza</h1>
            <p className="text-xs text-muted-foreground">Respetuosa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11",
                currentSection === item.id && "bg-sage-100 text-primary font-medium"
              )}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* User info */}
      <div className="p-4 border-t">
        <div className="bg-sage-50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Tu código:</p>
          <p className="font-mono font-bold text-primary">{userCode || 'CR-XXXXXXXX'}</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { currentSection, setSection, sidebarOpen, setSidebarOpen, user } = useAppStore();

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <NavContent 
            currentSection={currentSection}
            setSection={setSection}
            setSidebarOpen={setSidebarOpen}
            userCode={user?.code}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 border-r bg-white flex-col">
        <NavContent 
          currentSection={currentSection}
          setSection={setSection}
          setSidebarOpen={setSidebarOpen}
          userCode={user?.code}
        />
      </aside>
    </>
  );
}
