"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CAFE_TYPE_OPTIONS } from "@/globals/data-options";
import { authClient } from "@/lib/auth-client";
import { mutationFetcher } from "@/lib/swr";
import {
    type CreateCafeRecommendation,
    createCafeRecommendationSchema,
} from "@/schemas/cafe-recommendations.dto";

export default function UserRecommendation() {
    const router = useRouter();
    const { data: session, isPending: isSessionLoading } = authClient.useSession();

    const { trigger, isMutating } = useSWRMutation(
        "cafe-recommendations",
        mutationFetcher
    );

    const form = useForm<CreateCafeRecommendation>({
        resolver: zodResolver(createCafeRecommendationSchema),
        defaultValues: {
            cafeName: "",
            address: "",
            cafeType: undefined,
        },
    });

    const onSubmit = async (values: CreateCafeRecommendation) => {
        try {
            if (!session) {
                toast.error("Anda harus login untuk merekomendasikan kafe.");
                router.push("/login");
                return;
            }

            await trigger({ method: "POST", body: values });

            toast.success("Rekomendasi Berhasil Dikirim!", {
                description: "Terima kasih! Kami akan segera meninjau saran kafe Anda.",
            });
            form.reset();
            router.push("/");
        } catch (error: any) {
            toast.error("Gagal Mengirim Rekomendasi", {
                description: "Terjadi kesalahan sistem. Silakan coba lagi beberapa saat lagi.",
            });
        }
    };

    if (isSessionLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <HugeiconsIcon icon={Loading03Icon} className="animate-spin size-8 text-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="container max-w-md mx-auto py-20 px-4 flex flex-col items-center text-center space-y-4">
                <div className="bg-muted p-4 rounded-full">
                    <HugeiconsIcon icon={SentIcon} className="size-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Login Diperlukan</h1>
                <p className="text-muted-foreground">
                    Anda perlu login untuk merekomendasikan tempat baru kepada komunitas kami.
                </p>
                <Button asChild className="w-full">
                    <Link href="/login">Login Sekarang</Link>
                </Button>
                <Button variant="ghost" asChild className="w-full">
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        );
    }

    return (
        // <div className="bg-muted/30 min-h-screen py-10 px-4 md:px-8">
        //     <div className="container max-w-3xl mx-auto space-y-8">



        //     </div>
        // </div>

        <div className="space-y-5">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">
                    Rekomendasikan Tempat Baru
                </h1>
                <p className="text-muted-foreground text-lg">
                    Tahu kafe keren yang belum ada di Ngarembug? Beritahu kami!
                </p>
            </div>
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Formulir Rekomendasi</CardTitle>
                    <CardDescription>
                        Isi detail kafe di bawah ini. Semakin lengkap, semakin cepat kami
                        memverifikasinya.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="cafeName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Kafe</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: Kopi Kenangan Mantan"
                                                    {...field}
                                                    disabled={isMutating}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cafeType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipe Kafe</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isMutating}
                                            >
                                                <FormControl className="w-full">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih tipe kafe" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CAFE_TYPE_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat Lengkap</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Jalan, Nomor, Daerah..."
                                                {...field}
                                                disabled={isMutating}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Pastikan alamat mudah ditemukan via Google Maps.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isMutating}
                                    className="w-full md:w-auto"
                                >
                                    {isMutating ? (
                                        <>
                                            <HugeiconsIcon
                                                icon={Loading03Icon}
                                                className="mr-2 animate-spin"
                                            />
                                            Mengirim...
                                        </>
                                    ) : (
                                        "Kirim Rekomendasi"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}