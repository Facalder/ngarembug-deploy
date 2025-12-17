"use client";

import * as React from "react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  showStrengthMeter?: boolean;
  className?: string;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, showStrengthMeter = false, value = "", disabled, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [passwordStrength, setPasswordStrength] = React.useState(0);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Hitung kekuatan password (hanya kalau diaktifkan)
    React.useEffect(() => {
      if (!showStrengthMeter) return;

      const pwd = String(value);
      let strength = 0;

      if (pwd.length >= 10) strength += 25;
      if (pwd.length >= 14) strength += 25;
      if (/[A-Z]/.test(pwd)) strength += 25;
      if (/[^a-zA-Z0-9]/.test(pwd)) strength += 25;

      setPasswordStrength(strength);
    }, [value, showStrengthMeter]);

    const getStrengthColor = () => {
      if (passwordStrength <= 25) return "bg-red-500";
      if (passwordStrength <= 50) return "bg-orange-500";
      if (passwordStrength <= 75) return "bg-yellow-500";
      return "bg-green-500";
    };

    const getStrengthText = () => {
      if (passwordStrength <= 25) return "Lemah";
      if (passwordStrength <= 50) return "Sedang";
      if (passwordStrength <= 75) return "Kuat";
      return "Sangat Kuat";
    };

    return (
      <div className="space-y-2">
        <div
          className={cn(
            "relative flex items-center w-full rounded-md border border-input bg-transparent shadow-xs",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          )}
        >
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              "border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "pr-10",
              className,
            )}
            value={value}
            disabled={disabled}
            {...props}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 w-6 h-6"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            tabIndex={-1}
          >
            {showPassword ? (
              <HugeiconsIcon
                icon={ViewOffIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            ) : (
              <HugeiconsIcon
                icon={ViewIcon}
                className="h-4 w-4 text-muted-foreground"
              />
            )}
          </Button>
        </div>

        {/* Strength meter (hanya jika diaktifkan) */}
        {showStrengthMeter && value.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Kekuatan password:</span>
              <span
                className={cn(
                  "font-medium",
                  passwordStrength <= 50 ? "text-orange-600" : "text-green-600",
                )}
              >
                {getStrengthText()}
              </span>
            </div>

            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  getStrengthColor(),
                )}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
