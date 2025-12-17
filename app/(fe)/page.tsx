"use client";

import { useState } from "react";
import useSWR from "swr";
import { AreaCafeSection } from "@/components/section/area-cafe-section";
import { CafeSection } from "@/components/section/cafe-section";
import { HeroSection } from "@/components/section/hero-section";
import { PLACEHODER_IMAGE } from "@/globals/globals";
import { fetcher } from "@/lib/swr";

export default function Home() {
  const [selectedArea, setSelectedArea] = useState("sukabirus");

  // Fetch Trending Cafes
  const { data: trendingData, isLoading: isTrendingLoading } = useSWR(
    "/cafes?page1&regions=sukabirus&contentStatus=published",
    fetcher,
  );

  // Fetch Area Cafes
  const { data: areaData, isLoading: isAreaLoading } = useSWR(
    `/cafes?contentStatus=published&region=${selectedArea}`,
    fetcher,
  );

  const formatCafeData = (cafes: any[]) => {
    return (
      cafes?.map((cafe: any) => ({
        id: cafe.id,
        name: cafe.name,
        image: cafe.thumbnail || PLACEHODER_IMAGE,
        rating: cafe.averageRating || 0,
        reviewCount: cafe.totalReviews || 0,
        area: cafe.region,
        type: cafe.cafeType,
        distance: cafe.distance || "N/A",
        openingHours: cafe.openingTime
          ? `${cafe.openingTime} - ${cafe.closingTime}`
          : "Lihat detail",
        priceRange: cafe.priceRange,
        capacity: cafe.capacity ? `${cafe.capacity} orang` : "N/A",
        facilities: cafe.facilities?.map((f: any) => f.name || f.slug) || [],
        slug: cafe.slug,
      })) || []
    );
  };

  return (
    <>
      <HeroSection />

      {isTrendingLoading ? (
        <div className="text-center py-10">Loading Trending...</div>
      ) : (
        <CafeSection
          title="What's on trending?"
          subtitle="Yuk, dicek koleksi cafe terpopuler, favoritnya mahasiswa Tel-U!"
          cafes={formatCafeData(trendingData?.data)}
        />
      )}

      <AreaCafeSection
        cafes={formatCafeData(areaData?.data)}
        isLoading={isAreaLoading}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
      />
    </>
  );
}
