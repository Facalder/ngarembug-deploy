import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container-layout";
import { CafeDetailHeader } from "@/components/section/cafe-detail-header";
import { CafeDetailInfo } from "@/components/section/cafe-detail-info";

// Revalidate every 5 minutes
export const revalidate = 300;

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getCafe(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
        const res = await fetch(
            `${baseUrl}/api/cafes?slug=${slug}&contentStatus=published`,
            {
                next: { revalidate: 300 },
            },
        );

        if (!res.ok) return null;

        const json = await res.json();
        return json.data?.[0] || null;
    } catch (error) {
        console.error("Error fetching cafe:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const cafe = await getCafe(slug);

    if (!cafe) {
        return {
            title: "Cafe Not Found",
        };
    }

    return {
        title: `${cafe.name} - Ngarembug`,
        description:
            cafe.description?.slice(0, 160) || `Detail info for ${cafe.name}`,
        openGraph: {
            images: cafe.thumbnail ? [cafe.thumbnail] : [],
        },
    };
}

import { findReviews } from "@/repositories/reviews.repositories";

export default async function CafeDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Parallel fetching for performance
    const cafeData = getCafe(slug);

    // We need cafe data first to get ID for reviews, but let's see if we can get it differently.
    // getCafe returns ID. So we must await cafe first.

    const cafe = await cafeData;

    if (!cafe) {
        notFound();
    }

    // Fetch reviews
    const { data: reviews } = await findReviews({
        cafeId: cafe.id,
        page: 1,
        limit: 50 // Show reasonable amount of recent reviews
        ,
        rating: undefined,
        visitorType: undefined
    });

    return (
        <main className="min-h-screen bg-background pb-12">
            <CafeDetailHeader cafe={cafe} />

            <Container size="lg" className="mt-8">
                <CafeDetailInfo
                    cafe={cafe}
                    facilities={cafe.facilities || []}
                    reviews={reviews}
                />
            </Container>
        </main>
    );
}
