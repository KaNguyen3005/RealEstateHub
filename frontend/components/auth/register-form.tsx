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
import { getRoleHomePath } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterFormValues,
} from "@/lib/validations/auth.schema";

const fieldBaseClass =
  "mt-2 bg-background/90 shadow-sm shadow-black/5 transition focus-visible:border-primary/60";

export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await apiClient.post<{ user: User; accessToken: string }>("/api/auth/register", {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        password: values.password,
      });

      if (!response.data?.user || !response.data?.accessToken) {
        throw new Error("Phản hồi đăng ký không hợp lệ");
      }

      setAuth(response.data.user, response.data.accessToken);
      setSubmitSuccess("Đăng ký thành công. Đang chuyển hướng...");
      reset({
        fullName: "",
        email: "",
        phone: "",
        role: values.role,
        password: "",
        confirmPassword: "",
      });

      router.replace(getRoleHomePath(response.data.user.role));
    } catch (error) {
      if (error instanceof ApiClientError) {
        const message = error.message || "Đăng ký thất bại";

        // Kiểm tra mã lỗi 409 hoặc chuỗi text để map lỗi vào ô input Email
        if (error.status === 409 || message.toLowerCase().includes("email already exists") || message.toLowerCase().includes("email đã tồn tại")) {
          setError("email", {
            type: "server",
            message,
          });
        }

        setSubmitError(message);
        return;
      }

      setSubmitError("Đăng ký thất bại. Vui lòng thử lại sau.");
    }
  });

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-border/70 bg-background/85 p-6 shadow-[0_20px_60px_rgba(53,36,20,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Tạo tài khoản
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Đăng ký RealEstateHub
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Tạo tài khoản của bạn chỉ trong vài bước nhanh chóng.
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                aria-invalid={Boolean(errors.fullName)}
                className={cn(fieldBaseClass, errors.fullName && "border-destructive focus-visible:ring-destructive")}
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p className="mt-2 text-sm text-destructive">{errors.fullName.message}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vi-du@example.com"
                aria-invalid={Boolean(errors.email)}
                className={cn(fieldBaseClass, errors.email && "border-destructive focus-visible:ring-destructive")}
                {...register("email")}
              />
              {errors.email ? <p className="mt-2 text-sm text-destructive">{errors.email.message}</p> : null}
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0909000000"
                aria-invalid={Boolean(errors.phone)}
                className={cn(fieldBaseClass, errors.phone && "border-destructive focus-visible:ring-destructive")}
                {...register("phone")}
              />
              {errors.phone ? <p className="mt-2 text-sm text-destructive">{errors.phone.message}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="role">Loại tài khoản</Label>
              <select
                id="role"
                aria-invalid={Boolean(errors.role)}
                className={cn(
                  fieldBaseClass,
                  "flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none bg-background",
                  errors.role && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("role")}
              >
                <option value="user">Người tìm mua / thuê</option>
                <option value="seller">Người đăng tin / Môi giới</option>
              </select>
              {errors.role ? <p className="mt-2 text-sm text-destructive">{errors.role.message}</p> : null}
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                aria-invalid={Boolean(errors.password)}
                className={cn(fieldBaseClass, errors.password && "border-destructive focus-visible:ring-destructive")}
                {...register("password")}
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                aria-invalid={Boolean(errors.confirmPassword)}
                className={cn(
                  fieldBaseClass,
                  errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="mt-2 text-sm text-destructive">{errors.confirmPassword.message}</p>
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
              Đạo tài khoản
            </LoadingButton>
            <Button asChild type="button" variant="ghost" className="w-full sm:w-auto">
              <Link href="/login">Bạn đã có tài khoản?</Link>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}