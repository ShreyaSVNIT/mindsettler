import HeroSection from "@/components/HeroSection";
import MentalHealthBasics from "@/components/MentalHealthBasics";
import JourneyRoadmap from "@/components/JourneyRoadmap";
import MusicPlayer from "@/components/MusicPlayer";
import MissionStatement from "@/components/MissionStatement";
import ChatWidget from "../ChatBot/ChatWidget";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-app">
      <HeroSection />
      <MentalHealthBasics />
      <MissionStatement />
      <JourneyRoadmap />
      <MusicPlayer />
      <ChatWidget />
    </main>
  );
}
