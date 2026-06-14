"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LoadingButton } from "@/components/common/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, ApiClientError } from "@/lib/api";
import { getRoleHomePath, getSafeNextPath } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";
import {
  loginSchema,
  type LoginFormInput,
  type LoginFormValues,
} from "@/lib/validations/auth.schema";

const fieldBaseClass =
  "mt-2 bg-background/90 shadow-sm shadow-black/5 transition focus-visible:border-primary/60";

interface LoginFormProps {
  initialNotice?: string | null;
  nextPath?: string | null;
}

export function LoginForm({ initialNotice = null, nextPath = null }: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await apiClient.post<{ user: User; accessToken: string }>(
        "/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (!response.data?.user || !response.data?.accessToken) {
        throw new Error("Phản hồi đăng nhập không hợp lệ");
      }

      setAuth(response.data.user, response.data.accessToken);
      setSubmitSuccess(
        response.message || "Đăng nhập thành công. Phiên làm việc của bạn đã được khởi tạo."
      );
      reset({
        email: values.email,
        password: "",
      });

      router.replace(getSafeNextPath(nextPath) || getRoleHomePath(response.data.user.role));
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message || "Đăng nhập thất bại");
        return;
      }

      setSubmitError("Đăng nhập thất bại. Vui lòng thử lại sau.");
    }
  });

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-border/70 bg-background/85 p-6 shadow-[0_20px_60px_rgba(53,36,20,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Chào mừng trở lại
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Đăng nhập vào RealEstateHub
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Đăng nhập bằng email và mật khẩu của bạn để tiếp tục.
          </p>
        </div>

        {initialNotice ? (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {initialNotice}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vi-du@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={cn(
                  fieldBaseClass,
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("email")}
              />
              {errors.email ? (
                <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                className={cn(
                  fieldBaseClass,
                  errors.password && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("password")}
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {submitError}
            </div>
          ) : null}

          {submitSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {submitSuccess}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <LoadingButton type="submit" loading={isSubmitting} className="w-full sm:w-auto">
              Đăng nhập
            </LoadingButton>
            <Button asChild type="button" variant="ghost" className="w-full sm:w-auto">
              <Link href="/register">Tạo tài khoản mới</Link>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}