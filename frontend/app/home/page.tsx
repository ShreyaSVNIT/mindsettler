import HeroSection from "@/components/HeroSection";
import MentalHealthBasics from "@/components/MentalHealthBasics";
import JourneyRoadmap from "@/components/JourneyRoadmap";
import ClientMusicPlayer from '@/components/ClientMusicPlayer';
import MissionStatement from "@/components/MissionStatement";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-app">
      <HeroSection />
      <MentalHealthBasics />
      <MissionStatement />
      <JourneyRoadmap />
      <ClientMusicPlayer />
    </main>
  );
}
