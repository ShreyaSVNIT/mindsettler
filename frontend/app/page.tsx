import HeroSection from "@/components/HeroSection";
// import WaveDivider from "@/components/WaveDivider";
import MentalHealthBasics from "@/components/MentalHealthBasics";
import JourneyRoadmap from "@/components/JourneyRoadmap";
import Different from "@/components/Different";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-app">
      {/* <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-title text-primary mb-6">
          MindSettler
        </h1>

        <p className="text-text-body text-lg mb-8">
          MindSettler offers structured, confidential mental wellness
          sessions—both online and offline—designed to help you understand
          yourself better.
        </p>

        <p className="text-text-body">
          This is a temporary homepage to verify routing and design setup.
        </p>
      </div> */}
      <HeroSection />
      {/* <WaveDivider /> */}
      <MentalHealthBasics />
      <Different /> 
      <JourneyRoadmap />
    </main>
  );
}
