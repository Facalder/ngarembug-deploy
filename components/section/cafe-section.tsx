"use client"

import { CafeCard } from "@/components/card/cafe-card"

interface Cafe {
    id: string
    name: string
    image: string
    rating: number
    reviewCount: number

    // Updated fields
    region: string
    cafeType: string
    distance: number
    priceRange: string
    pricePerPerson: number
    capacity: number
    facilities: { name?: string; slug: string }[] | string[]
    slug?: string

    // Legacy fields (optional if still used elsewhere, but ideally remove)
    area?: string
    type?: string
    openingHours?: string
}

interface CafeSectionProps {
    title?: string
    subtitle?: string
    cafes?: Cafe[]
    location?: string
}

export function CafeSection({
    title,
    subtitle,
    cafes,
    location = "Batununggal",
}: CafeSectionProps) {
    return (
        <section className="space-y-8 mx-auto">
            <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {title || `What's on trending di ${location}?`}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg">
                    {subtitle || "Yuk, dicek koleksi cafe terpopuler, favoritnya mahasiswa Tel-U!"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cafes?.map((cafe) => (
                    <CafeCard
                        key={cafe.id}
                        href={`/cafe/${cafe.slug || cafe.id}`}
                        image={cafe.image}
                        rating={cafe.rating}
                        reviewCount={cafe.reviewCount}
                        name={cafe.name}
                        region={cafe.region}
                        cafeType={cafe.cafeType}
                        distance={cafe.distance}
                        priceRange={cafe.priceRange}
                        pricePerPerson={cafe.pricePerPerson}
                        capacity={cafe.capacity}
                        facilities={cafe.facilities}
                    />
                ))}
            </div>
        </section>
    )
}
