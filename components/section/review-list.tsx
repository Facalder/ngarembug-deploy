import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Review {
    id: string;
    rating: string;
    review: string;
    title: string;
    visitorType: string;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    } | null;
}

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>Belum ada review. Jadilah yang pertama mereview!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={review.user?.image || ""}
                                    alt={review.user?.name || "User"}
                                />
                                <AvatarFallback>
                                    {review.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-semibold text-sm">
                                    {review.user?.name || "Anonymous"}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                            {review.visitorType}
                        </Badge>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <span className="font-bold text-sm">
                            {formatRating(review.rating)}
                        </span>
                        <h5 className="font-semibold">{review.title}</h5>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        {review.review}
                    </p>
                </div>
            ))}
        </div>
    );
}

function formatRating(rating: string): string {
    const map: Record<string, string> = {
        satu: "⭐ 1/5",
        dua: "⭐⭐ 2/5",
        tiga: "⭐⭐⭐ 3/5",
        empat: "⭐⭐⭐⭐ 4/5",
        lima: "⭐⭐⭐⭐⭐ 5/5",
    };
    return map[rating] || rating;
}
