import { useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import SearchForm from "@/components/SearchForm";
import PropertyList from "@/components/PropertyList";
import Footer from "@/components/Footer";

const Index = () => {
  const [_searchFilters, setSearchFilters] = useState<any>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <HeroCarousel />
        <SearchForm onSearch={setSearchFilters} />
        <div className="mt-10">
          <PropertyList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
