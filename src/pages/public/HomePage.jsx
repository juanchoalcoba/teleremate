import HeroSection from "../../components/home/HeroSection";
import StatsBar from "../../components/home/StatsBar";
import AboutSection from "../../components/home/AboutSection";
import FeaturedArticles from "../../components/home/FeaturedArticles";
import HowItWorks from "../../components/home/HowItWorks";

export default function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <FeaturedArticles />
      <HowItWorks />
    </div>
  );
}
