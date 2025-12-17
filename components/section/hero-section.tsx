"use client";

import { Search01FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CafeTypeFilter } from "@/components/filter/cafe-type-filter";
import { FacilitiesFilter } from "@/components/filter/facilities-filter";
import { LocationFilter } from "@/components/filter/location-filter";
import { Button } from "@/components/ui/button";


export function HeroSection() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation) params.set("region", selectedLocation);
    if (selectedType) params.set("cafeType", selectedType);
    if (selectedFacilities.length > 0) {
      params.set("facilities", selectedFacilities.join(","));
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[64vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section.webp"
          alt="Cafe background"
          fill
          className="object-cover bg-center rounded-xl"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-12 text-balance">
          Hai kamu, mau rapat dimana?
        </h1>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-center w-full">
          <LocationFilter
            value={selectedLocation}
            onChange={setSelectedLocation}
            className="w-full lg:w-auto justify-between"
          />

          <CafeTypeFilter
            value={selectedType}
            onChange={setSelectedType}
            className="w-full lg:w-auto justify-between"
          />

          <FacilitiesFilter
            value={selectedFacilities}
            onChange={setSelectedFacilities}
            className="w-full lg:w-auto justify-between"
          />

          {/* Search Button */}
          <Button
            variant='default'
            className="w-full md:w-auto cursor-pointer rounded-full px-6 py-3 text-base font-bold shadow-lg h-auto hover:bg-primary/90 justify-center"
            onClick={handleSearch}
          >
            <span className="mr-2">Cari Cafe</span>
            <HugeiconsIcon icon={Search01FreeIcons} className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
