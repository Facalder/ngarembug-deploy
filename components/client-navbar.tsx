"use client";

import {
    Logout02Icon,
    Menu01Icon,
    UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Container } from "@/components/container-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function ClientNavbar() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    router.refresh();
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <Container
                size="lg"
                className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:h-16 lg:py-0"
            >
                <div className="flex items-center justify-between w-full gap-5">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/ngarembug_logo.svg"
                            alt="Ngarembug Logo"
                            width={40}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>

                    {/* Desktop: Search + Navigation */}
                    <div className="hidden md:flex items-center gap-6 flex-1">
                        <Link
                            href="/search"
                            className="font-medium text-foreground hover:text-primary transition-colors text-base whitespace-nowrap"
                        >
                            Cari Cafe
                        </Link>

                        <Link
                            href="/user-recommendation"
                            className="font-medium text-foreground hover:text-primary transition-colors text-base whitespace-nowrap"
                        >
                            Beri Rekomendasi
                        </Link>
                    </div>

                    {/* Desktop: Auth Buttons or User Profile */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={session.user.image || ""}
                                                alt={session.user.name}
                                            />
                                            <AvatarFallback>
                                                {session.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <HugeiconsIcon
                                            icon={Logout02Icon}
                                            className="mr-2 h-4 w-4"
                                        />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="font-semibold"
                                    asChild
                                >
                                    <Link href="/login">Masuk</Link>
                                </Button>
                                <Button size="lg" asChild>
                                    <Link href="/signup">Buat Akun</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile: Menu */}
                    <div className="flex md:hidden gap-1">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={session.user.image || ""}
                                                alt={session.user.name}
                                            />
                                            <AvatarFallback>
                                                {session.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link
                                                href="/user-recommendation"
                                                className="w-full flex items-center"
                                            >
                                                <span>Beri Rekomendasi</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link href="/search" className="w-full flex items-center">
                                                <span>Cari Cafe</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <HugeiconsIcon
                                            icon={Logout02Icon}
                                            className="mr-2 h-4 w-4"
                                        />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="ghost" size="icon-lg">
                                    <HugeiconsIcon icon={UserCircle02Icon} className="size-6" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon-lg"
                                            suppressHydrationWarning
                                        >
                                            <HugeiconsIcon icon={Menu01Icon} className="size-6" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href="/search" className="w-full cursor-pointer">
                                                Cari Cafe
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/recommend" className="w-full cursor-pointer">
                                                Beri Rekomendasi
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/login" className="w-full cursor-pointer">
                                                Masuk
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/signup" className="w-full cursor-pointer">
                                                Buat Akun
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
}
