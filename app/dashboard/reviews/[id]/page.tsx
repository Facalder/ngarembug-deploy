import { notFound } from "next/navigation";
import DashboardTitle from "@/components/dashboard-title";
import { getReviewById } from "@/repositories/reviews.repositories";

interface ReviewDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
    const { id } = await params;

    const review = await getReviewById(id);

    if (!review) {
        notFound();
    }

    return (
        <>
            <DashboardTitle
                title={`Review: ${review.title}`}
                subtitle={`By ${review.user?.name || "Unknown"} for ${review.cafe?.name || "Unknown"}`}
            />

            <div className="rounded-lg border bg-card p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">User</h3>
                        <p className="text-base">{review.user?.name || "Unknown"}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Cafe</h3>
                        <p className="text-base">{review.cafe?.name || "Unknown"}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Rating</h3>
                        <p className="text-base">{["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"][["satu", "dua", "tiga", "empat", "lima"].indexOf(review.rating)] || review.rating}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Tipe Pengunjung</h3>
                        <p className="text-base capitalize">{review.visitorType.replace(/_/g, " ")}</p>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Judul</h3>
                        <p className="text-base font-semibold">{review.title}</p>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Review</h3>
                        <p className="text-base whitespace-pre-wrap">{review.review}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Dibuat</h3>
                        <p className="text-sm">{new Date(review.createdAt).toLocaleString("id-ID")}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Diperbarui</h3>
                        <p className="text-sm">{new Date(review.updatedAt).toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
