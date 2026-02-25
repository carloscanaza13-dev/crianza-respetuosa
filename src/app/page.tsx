'use client';

import { useAppStore } from '@/store/app-store';
import { Sidebar } from '@/components/sidebar';
import { OnboardingDialog } from '@/components/onboarding-dialog';
import { ConsultationSection } from '@/components/consultation-section';
import { ModulesSection } from '@/components/modules-section';
import { PhrasesSection } from '@/components/phrases-section';
import { ProgressSection } from '@/components/progress-section';
import { AcademicSection } from '@/components/academic-section';
import { Footer } from '@/components/footer';

export default function Home() {
  const { currentSection, showOnboarding } = useAppStore();

  const renderSection = () => {
    switch (currentSection) {
      case 'consultation':
        return <ConsultationSection />;
      case 'modules':
        return <ModulesSection />;
      case 'phrases':
        return <PhrasesSection />;
      case 'progress':
        return <ProgressSection />;
      case 'academic':
        return <AcademicSection />;
      default:
        return <ConsultationSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Onboarding */}
      {showOnboarding && <OnboardingDialog />}
      
      {/* Main Layout */}
      <div className="flex-1 flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {renderSection()}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
