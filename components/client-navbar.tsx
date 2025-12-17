// "use client";

// import {
//     CreditCardIcon,
//     Logout02Icon,
//     Menu01Icon,
//     Notification01Icon,
//     Search01Icon,
//     UserCircle02Icon,
// } from "@hugeicons/core-free-icons";
// import { HugeiconsIcon } from "@hugeicons/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { Container } from "@/components/container-layout";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { authClient } from "@/lib/auth-client";

// export function ClientNavbar() {
//     const router = useRouter();
//     const { data: session } = authClient.useSession();

//     const handleLogout = async () => {
//         await authClient.signOut({
//             fetchOptions: {
//                 onSuccess: () => {
//                     router.push("/login");
//                     router.refresh();
//                 },
//             },
//         });
//     };

//     return (
//         <header className="sticky top-0 z-50 w-full border-b bg-background">
//             <Container
//                 size="lg"
//                 className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:h-16 lg:py-0"
//             >
//                 <div className="flex items-center justify-between w-full gap-5">
//                     {/* Logo */}
//                     <Link href="/" className="flex items-center">
//                         <Image
//                             src="/images/ngarembug_logo.svg"
//                             alt="Ngarembug Logo"
//                             width={40}
//                             height={40}
//                             className="h-8 w-auto"
//                         />
//                     </Link>

//                     {/* Desktop: Search + Navigation */}
//                     <div className="hidden md:flex items-center gap-6 flex-1">
//                         <div className="relative w-full max-w-xs hidden lg:block">
//                             <HugeiconsIcon
//                                 icon={Search01Icon}
//                                 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
//                             />
//                             <Input
//                                 placeholder="Cari tempat rapat yang enak"
//                                 className="w-full pl-9 pr-4 bg-muted/50 border-transparent hover:bg-muted focus-visible:bg-background focus-visible:border-input rounded-full h-10 transition-colors"
//                             />
//                         </div>

//                         <Link
//                             href="/search"
//                             className="font-medium text-foreground hover:text-primary transition-colors text-base whitespace-nowrap"
//                         >
//                             Cari Cafe
//                         </Link>

//                         <Link
//                             href="/user-recommendation"
//                             className="font-medium text-foreground hover:text-primary transition-colors text-base whitespace-nowrap"
//                         >
//                             Beri Rekomendasi
//                         </Link>
//                     </div>

//                     {/* Desktop: Auth Buttons or User Profile */}
//                     <div className="hidden md:flex items-center gap-3">
//                         {session ? (
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button
//                                         variant="ghost"
//                                         className="relative h-10 w-10 rounded-full"
//                                     >
//                                         <Avatar className="h-10 w-10">
//                                             <AvatarImage
//                                                 src={session.user.image || ""}
//                                                 alt={session.user.name}
//                                             />
//                                             <AvatarFallback>
//                                                 {session.user.name.charAt(0).toUpperCase()}
//                                             </AvatarFallback>
//                                         </Avatar>
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                                     <DropdownMenuLabel className="font-normal">
//                                         <div className="flex flex-col space-y-1">
//                                             <p className="text-sm font-medium leading-none">
//                                                 {session.user.name}
//                                             </p>
//                                             <p className="text-xs leading-none text-muted-foreground">
//                                                 {session.user.email}
//                                             </p>
//                                         </div>
//                                     </DropdownMenuLabel>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuGroup>
//                                         <DropdownMenuItem className="cursor-pointer">
//                                             <HugeiconsIcon
//                                                 icon={UserCircle02Icon}
//                                                 className="mr-2 h-4 w-4"
//                                             />
//                                             <span>Profile</span>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem className="cursor-pointer">
//                                             <HugeiconsIcon
//                                                 icon={CreditCardIcon}
//                                                 className="mr-2 h-4 w-4"
//                                             />
//                                             <span>Billing</span>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem className="cursor-pointer">
//                                             <HugeiconsIcon
//                                                 icon={Notification01Icon}
//                                                 className="mr-2 h-4 w-4"
//                                             />
//                                             <span>Notifications</span>
//                                         </DropdownMenuItem>
//                                     </DropdownMenuGroup>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem
//                                         onClick={handleLogout}
//                                         className="cursor-pointer text-red-600 focus:text-red-600"
//                                     >
//                                         <HugeiconsIcon
//                                             icon={Logout02Icon}
//                                             className="mr-2 h-4 w-4"
//                                         />
//                                         <span>Log out</span>
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         ) : (
//                             <>
//                                 <Button
//                                     variant="ghost"
//                                     size="lg"
//                                     className="font-semibold"
//                                     asChild
//                                 >
//                                     <Link href="/login">Masuk</Link>
//                                 </Button>
//                                 <Button size="lg" asChild>
//                                     <Link href="/signup">Buat Akun</Link>
//                                 </Button>
//                             </>
//                         )}
//                     </div>

//                     {/* Mobile: Menu */}
//                     <div className="flex md:hidden gap-1">
//                         {session ? (
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button
//                                         variant="ghost"
//                                         className="relative h-10 w-10 rounded-full"
//                                     >
//                                         <Avatar className="h-8 w-8">
//                                             <AvatarImage
//                                                 src={session.user.image || ""}
//                                                 alt={session.user.name}
//                                             />
//                                             <AvatarFallback>
//                                                 {session.user.name.charAt(0).toUpperCase()}
//                                             </AvatarFallback>
//                                         </Avatar>
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                                     <DropdownMenuLabel className="font-normal">
//                                         <div className="flex flex-col space-y-1">
//                                             <p className="text-sm font-medium leading-none">
//                                                 {session.user.name}
//                                             </p>
//                                             <p className="text-xs leading-none text-muted-foreground">
//                                                 {session.user.email}
//                                             </p>
//                                         </div>
//                                     </DropdownMenuLabel>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuGroup>
//                                         <DropdownMenuItem className="cursor-pointer">
//                                             <Link
//                                                 href="/user-recommendation"
//                                                 className="w-full flex items-center"
//                                             >
//                                                 <span>Beri Rekomendasi</span>
//                                             </Link>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem className="cursor-pointer">
//                                             <Link href="/search" className="w-full flex items-center">
//                                                 <span>Cari Cafe</span>
//                                             </Link>
//                                         </DropdownMenuItem>
//                                     </DropdownMenuGroup>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem
//                                         onClick={handleLogout}
//                                         className="cursor-pointer text-red-600 focus:text-red-600"
//                                     >
//                                         <HugeiconsIcon
//                                             icon={Logout02Icon}
//                                             className="mr-2 h-4 w-4"
//                                         />
//                                         <span>Log out</span>
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         ) : (
//                             <>
//                                 <Button variant="ghost" size="icon-lg">
//                                     <HugeiconsIcon icon={UserCircle02Icon} className="size-6" />
//                                 </Button>
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon-lg"
//                                             suppressHydrationWarning
//                                         >
//                                             <HugeiconsIcon icon={Menu01Icon} className="size-6" />
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent align="end" className="w-48">
//                                         <DropdownMenuItem asChild>
//                                             <Link href="/search" className="w-full cursor-pointer">
//                                                 Cari Cafe
//                                             </Link>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem asChild>
//                                             <Link href="/recommend" className="w-full cursor-pointer">
//                                                 Beri Rekomendasi
//                                             </Link>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuSeparator />
//                                         <DropdownMenuItem asChild>
//                                             <Link href="/login" className="w-full cursor-pointer">
//                                                 Masuk
//                                             </Link>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem asChild>
//                                             <Link href="/signup" className="w-full cursor-pointer">
//                                                 Buat Akun
//                                             </Link>
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 {/* Mobile: Search Bar */}
//                 <div className="flex lg:hidden w-full">
//                     <div className="relative w-full">
//                         <HugeiconsIcon
//                             icon={Search01Icon}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
//                         />
//                         <Input
//                             placeholder="Cari tempat rapat yang enak"
//                             className="w-full pl-10 pr-4 bg-muted/50 border-transparent hover:bg-muted focus-visible:bg-background focus-visible:border-input rounded-full h-11 transition-colors"
//                         />
//                     </div>
//                 </div>
//             </Container>
//         </header>
//     );
// }
