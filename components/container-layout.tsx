// components/layout/Container.tsx
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-3 md:px-4",
  md: "px-4 md:px-6",
  lg: "px-6 md:px-8 lg:px-12",
};

export function Container({
  children,
  className = "",
  size = "lg",
  padding = "md",
}: ContainerProps) {
  return (
    <div
      className={`${sizeClasses[size]} mx-auto ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// components/layout/Section.tsx
interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Section({
  children,
  className = "",
  containerSize = "lg",
  padding = "md",
}: SectionProps) {
  return (
    <section className={`py-8 md:py-12 lg:py-16 ${className}`}>
      <Container size={containerSize} padding={padding}>
        {children}
      </Container>
    </section>
  );
}

// components/layout/PageLayout.tsx
interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  withPadding?: boolean;
}

export function PageLayout({
  children,
  className = "",
  containerSize = "lg",
  withPadding = true,
}: PageLayoutProps) {
  return (
    <main className={`min-h-screen ${className}`}>
      <Container
        size={containerSize}
        padding={withPadding ? "md" : "none"}
        className="py-6 md:py-8 lg:py-12"
      >
        {children}
      </Container>
    </main>
  );
}
