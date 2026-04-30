import { useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import SearchForm from "@/components/SearchForm";
import PropertyList from "@/components/PropertyList";
import Footer from "@/components/Footer";

export interface SearchFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
}

const Index = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const handleSearch = (filters: { city: string; checkIn: Date | undefined; duration: number; guests: number }) => {
    const checkIn = filters.checkIn ? filters.checkIn.toISOString() : undefined;
    const checkOut = filters.checkIn && filters.duration
      ? new Date(new Date(filters.checkIn).getTime() + filters.duration * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    setSearchFilters({
      city: filters.city || undefined,
      checkIn,
      checkOut,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <HeroCarousel />
        <SearchForm onSearch={handleSearch} />
        <div className="mt-10">
          <PropertyList searchFilters={searchFilters} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
