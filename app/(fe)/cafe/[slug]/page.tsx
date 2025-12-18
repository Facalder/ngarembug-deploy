import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container-layout";
import { CafeDetailHeader } from "@/components/section/cafe-detail-header";
import { CafeDetailInfo } from "@/components/section/cafe-detail-info";
import { findCafes } from "@/repositories/cafes.repositories";
import { findReviews } from "@/repositories/reviews.repositories";

// Revalidate every 5 minutes
export const revalidate = 300;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    // Cast to any to bypass strict Zod inferred type mismatch for optional fields
    const { data } = await findCafes({ limit: 1000, contentStatus: ["published"] } as any);

    return data.map((cafe) => ({
        slug: cafe.slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await findCafes({ slug, contentStatus: ["published"] } as any);
    const cafe = data[0];

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

export default async function CafeDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch cafe directly from repository
    const { data } = await findCafes({ slug, contentStatus: ["published"] } as any);
    const cafe = data[0];

    if (!cafe) {
        notFound();
    }

    // Fetch reviews
    // Fetch reviews
    const { data: reviews } = await findReviews({
        cafeId: cafe.id,
        page: 1,
        limit: 50,
        rating: undefined,
        visitorType: undefined
    });

    return (
        <main className="min-h-screen bg-background pb-12">
            <CafeDetailHeader cafe={{
                ...cafe,
                averageRating: cafe.averageRating || 0,
                totalReviews: cafe.totalReviews || 0,
            }} />

            <Container size="lg" className="mt-8">
                <CafeDetailInfo
                    cafe={cafe}
                    facilities={(cafe.facilities as { name?: string; slug: string }[]) || []}
                    reviews={reviews || []}
                />
            </Container>
        </main>
    );
}
