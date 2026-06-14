import Link from "next/link";

const footerLinks = [
  { href: "/properties", label: "Bất động sản" },
  { href: "/compare", label: "So sánh" },
  { href: "/login", label: "Đăng nhập" },
  { href: "/register", label: "Đăng ký" }
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              RH
            </span>
            <div>
              <p className="font-semibold tracking-tight">RealEstateHub</p>
              <p className="text-sm text-muted-foreground">Sàn thương mại bất động sản thu nhỏ giúp mua bán, cho thuê và so sánh dự án.</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Duyệt danh sách tin đăng, so sánh các bất động sản, lưu tin yêu thích và kết nối trực tiếp với người bán trên một nền tảng mượt mà.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Liên kết nhanh
            </p>
            <div className="flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Liên hệ & Hỗ trợ
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Hỗ trợ người dùng, người bán và quản trị viên</p>
              <p>Giao diện tối ưu trên di động, máy tính bảng và máy tính</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 RealEstateHub. Giữ toàn bộ bản quyền.</p>
          <p>Phát triển bằng Next.js App Router và Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}