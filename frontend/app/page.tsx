import HeroSection from "@/components/HeroSection";
// import WaveDivider from "@/components/WaveDivider";
import MentalHealthBasics from "@/components/MentalHealthBasics";
import JourneyRoadmap from "@/components/JourneyRoadmap";
import MusicPlayer from "@/components/MusicPlayer";
import MissionStatement from "@/components/MissionStatement";
import ChatWidget from "./ChatBot/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-app">
      <HeroSection />
      {/* <WaveDivider /> */}
      <MentalHealthBasics />
      <MissionStatement />
      <JourneyRoadmap />
      <MusicPlayer />
      <ChatWidget />
    </main>
  );
}
