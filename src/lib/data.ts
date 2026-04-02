export type UserRole = "guest" | "user" | "tenant";

export interface Property {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  image: string;
  lowestPrice: number;
  rating: number;
}

export interface Room {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  image: string;
  description: string;
}

export interface PropertyDetail extends Property {
  photos: string[];
  address: string;
  amenities: string[];
  rooms: Room[];
}

export interface DatePrice {
  date: string;
  price: number;
  available: boolean;
}

export const CITIES = [
  "Jakarta", "Bali", "Yogyakarta", "Surabaya", "Bandung",
  "Lombok", "Medan", "Makassar", "Semarang", "Manado",
];

export const CATEGORIES = ["Hotel", "Villa", "Apartment", "Resort", "Guest House", "Hostel"];

export const MOCK_PROPERTIES: Property[] = [
  { id: "1", name: "The Grand Nusa Villa", category: "Villa", city: "Bali", description: "Breathtaking cliffside villa with private infinity pool and panoramic ocean views.", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop", lowestPrice: 2500000, rating: 4.9 },
  { id: "2", name: "Borobudur Heritage Hotel", category: "Hotel", city: "Yogyakarta", description: "A majestic boutique hotel blending Javanese cultural elegance with modern comfort.", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop", lowestPrice: 850000, rating: 4.7 },
  { id: "3", name: "Seminyak Sky Apartments", category: "Apartment", city: "Bali", description: "Chic rooftop apartments in the heart of Seminyak, steps from world-class dining.", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop", lowestPrice: 1200000, rating: 4.6 },
  { id: "4", name: "Bromo Highland Resort", category: "Resort", city: "Surabaya", description: "A nature retreat offering volcanic landscape views and authentic Tenggerese experiences.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", lowestPrice: 1750000, rating: 4.8 },
  { id: "5", name: "Bandung Art House", category: "Guest House", city: "Bandung", description: "A creative haven in a colonial Dutch building, surrounded by the city's coolest galleries.", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop", lowestPrice: 450000, rating: 4.5 },
  { id: "6", name: "Gili Islands Bungalow", category: "Villa", city: "Lombok", description: "Beachfront bungalows with turquoise waters at your doorstep. No cars, pure tranquility.", image: "https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&h=400&fit=crop", lowestPrice: 980000, rating: 4.8 },
  { id: "7", name: "Jakarta CBD Executive", category: "Apartment", city: "Jakarta", description: "Premium serviced apartments in the Golden Triangle, perfect for business travelers.", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop", lowestPrice: 1500000, rating: 4.4 },
  { id: "8", name: "Ubud Jungle Retreat", category: "Resort", city: "Bali", description: "Immerse yourself in Bali's spiritual heart — rice terraces, temple ceremonies, and spa bliss.", image: "https://images.unsplash.com/photo-1540541338537-1220059a6fc4?w=600&h=400&fit=crop", lowestPrice: 3200000, rating: 4.9 },
];

export const MOCK_PROPERTY_DETAILS: Record<string, PropertyDetail> = {
  "1": {
    id: "1", name: "The Grand Nusa Villa", category: "Villa", city: "Bali",
    address: "Jl. Uluwatu No. 88, Pecatu, Badung, Bali",
    description: "Perched dramatically above the Indian Ocean, The Grand Nusa Villa redefines luxury. This 4-bedroom cliffside retreat features a 20-meter infinity pool that appears to merge with the sea, a private cinema, a fully staffed kitchen, and curated Balinese artwork throughout.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop",
    ],
    rating: 4.9,
    lowestPrice: 2500000,
    amenities: ["Infinity Pool", "Private Chef", "Airport Transfer", "Spa", "Free WiFi", "Air Conditioning", "Gym", "Private Beach Access"],
    rooms: [
      { id: "r1", name: "Ocean Suite", basePrice: 2500000, capacity: 2, description: "Master suite with floor-to-ceiling ocean views and private terrace.", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop", amenities: ["WiFi", "AC", "TV", "Mini Bar", "Jacuzzi"] },
      { id: "r2", name: "Garden Pool Villa", basePrice: 3800000, capacity: 4, description: "Sprawling villa with private garden pool and outdoor dining pavilion.", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop", amenities: ["WiFi", "AC", "TV", "Mini Bar"] },
      { id: "r3", name: "Cliff Penthouse", basePrice: 5500000, capacity: 6, description: "The crown jewel — a two-level penthouse suite with 360° panoramic views.", image: "https://images.unsplash.com/photo-1540541338537-1220059a6fc4?w=400&h=300&fit=crop", amenities: ["WiFi", "AC", "TV", "Mini Bar", "Jacuzzi"] },
    ],
  },
  "2": {
    id: "2", name: "Borobudur Heritage Hotel", category: "Hotel", city: "Yogyakarta",
    address: "Jl. Magelang KM 26, Borobudur, Magelang",
    description: "Wake up to the silhouette of Borobudur temple at dawn. This heritage hotel combines authentic Javanese architecture with modern amenities, offering guided temple tours and traditional dance performances.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&h=600&fit=crop",
    ],
    rating: 4.7,
    lowestPrice: 850000,
    amenities: ["Temple View", "Cultural Tours", "Restaurant", "Spa", "Free WiFi", "Parking", "Swimming Pool"],
    rooms: [
      { id: "r1", name: "Joglo Heritage Room", basePrice: 850000, capacity: 2, description: "Traditional Javanese joglo-style room with carved teak furniture.", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop", amenities: ["WiFi", "AC", "TV"] },
      { id: "r2", name: "Temple View Suite", basePrice: 1500000, capacity: 3, description: "Front-row seat to Borobudur with a private balcony and telescope.", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop", amenities: ["WiFi", "AC", "TV", "Mini Bar"] },
    ],
  },
};

// Fill remaining IDs
for (let i = 3; i <= 8; i++) {
  const p = MOCK_PROPERTIES.find(p => p.id === String(i))!;
  MOCK_PROPERTY_DETAILS[String(i)] = {
    ...p,
    address: `Jl. Contoh No. ${i * 10}, ${p.city}`,
    photos: [p.image, MOCK_PROPERTIES[(i + 1) % MOCK_PROPERTIES.length].image],
    amenities: ["WiFi", "AC", "Parking", "Swimming Pool"],
    rooms: [
      { id: `r${i}-1`, name: "Standard Room", basePrice: p.lowestPrice, capacity: 2, description: "Comfortable standard room with modern amenities.", image: p.image, amenities: ["WiFi", "AC", "TV"] },
      { id: `r${i}-2`, name: "Deluxe Room", basePrice: Math.round(p.lowestPrice * 1.5), capacity: 3, description: "Spacious deluxe room with premium furnishings.", image: MOCK_PROPERTIES[(i + 1) % MOCK_PROPERTIES.length].image, amenities: ["WiFi", "AC", "TV", "Mini Bar"] },
    ],
  };
}

export function generatePriceCalendar(basePrice: number, seed: number = 1): DatePrice[] {
  const prices: DatePrice[] = [];
  const today = new Date();
  today.setDate(1);
  const start = new Date(today);
  const end = new Date(today);
  end.setMonth(end.getMonth() + 2);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    const dateStr = d.toISOString().split("T")[0];
    const rand = Math.sin(seed * 9301 + d.getDate() * 49297 + d.getMonth() * 233) * 0.5 + 0.5;
    const isWeekend = day === 0 || day === 6;
    const multiplier = isWeekend ? 1.3 + rand * 0.4 : 0.8 + rand * 0.5;
    const isUnavailable = rand > 0.88;
    prices.push({
      date: dateStr,
      price: Math.round((basePrice * multiplier) / 10000) * 10000,
      available: !isUnavailable,
    });
  }
  return prices;
}
