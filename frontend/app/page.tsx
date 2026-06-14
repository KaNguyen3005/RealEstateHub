import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProperties } from "@/lib/properties";

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const quickSearches = [
  { label: "Mua bán nhà đất", href: "/properties?purpose=sale", tone: "bg-blue-50 text-blue-700" },
  { label: "Nhà đất cho thuê", href: "/properties?purpose=rent", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Căn hộ / Chung cư", href: "/properties?type=apartment", tone: "bg-amber-50 text-amber-700" },
  { label: "Biệt thự", href: "/properties?type=villa", tone: "bg-slate-100 text-slate-700" },
] as const;

const highlights: Highlight[] = [
  {
    title: "Tìm kiếm rõ ràng",
    description: "Lọc theo vị trí, loại hình, nhu cầu, giá cả và diện tích để mỗi lượt tìm kiếm đều trả về kết quả hữu ích nhất.",
    icon: Search,
  },
  {
    title: "So sánh thông minh hơn",
    description: "Lập danh sách ngắn và đặt các căn nhà lên bàn cân so sánh trực quan trước khi đưa ra quyết định giá trị cao.",
    icon: BadgeCheck,
  },
  {
    title: "Kết nối nhanh chóng",
    description: "Gửi yêu cầu liên hệ hoặc mở cuộc trò chuyện trực tuyến tức thì ngay khi bạn tìm thấy tin đăng phù hợp.",
    icon: MessageCircle,
  },
  {
    title: "Tin đăng tin cậy",
    description: "Quy trình phê duyệt nghiêm ngặt từ quản trị viên giúp thị trường luôn minh bạch, an toàn và đáng tin cậy.",
    icon: ShieldCheck,
  },
];

const roleCards = [
  {
    title: "Dành cho Người mua & Người thuê",
    description: "Khám phá danh sách bất động sản đã kiểm duyệt, lưu tin yêu thích, so sánh đối chiếu và liên hệ người bán nhanh chóng.",
    icon: Heart,
  },
  {
    title: "Dành cho Người bán / Môi giới",
    description: "Tạo tin đăng bất động sản, tải lên hình ảnh, ghim vị trí chính xác và quản lý trạng thái tin đăng từ trang quản trị.",
    icon: Building2,
  },
  {
    title: "Dành cho Quản trị viên",
    description: "Kiểm duyệt các tin đăng đang chờ, giám sát hoạt động của nền tảng và quản lý người dùng tập trung tại một nơi.",
    icon: ShieldCheck,
  },
] satisfies Highlight[];

export default async function HomePage() {
  let featuredData;
  let featuredError: string | null = null;

  try {
    featuredData = await getProperties({ limit: "3" });
  } catch (error) {
    featuredError = error instanceof Error ? error.message : "Không thể tải danh sách bất động sản nổi bật.";
    featuredData = {
      items: [],
      page: 1,
      limit: 3,
      totalItems: 0,
      totalPages: 1,
    };
  }

  const featuredProperties = featuredData.items.slice(0, 3);
  const totalProperties = featuredData.totalItems;

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#ffffff_100%)]">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Nền tảng tìm kiếm nhà đất tin cậy cho thời đại mới
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              An tâm tìm kiếm không gian sống phù hợp.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              RealEstateHub đồng hành cùng người mua, người thuê và người bán trong việc tìm kiếm, so sánh, lưu trữ và kết nối trực tiếp xung quanh các nguồn tin đăng đã được xác thực.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-6">
              <Link href="/properties">
                Khám phá nhà đất
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-slate-300 bg-white/80 px-6">
              <Link href="/dashboard/properties/new">Đăng tin chính chủ</Link>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Tin đăng</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">{totalProperties}+</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Giải pháp</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">4 trong 1</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Truy cập</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">24/7</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -right-10 top-8 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
              <div className="grid min-h-[360px] content-between bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.82)),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_25%)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Sàn giao dịch nổi bật</p>
                    <h2 className="mt-2 max-w-xs text-3xl font-semibold tracking-tight">Tìm kiếm theo khu vực, ngân sách và phong cách sống.</h2>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
                    <Home className="h-6 w-6" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-blue-100">Căn hộ hiện đại</p>
                        <p className="mt-1 text-xl font-semibold">Trung tâm thành phố, dọn vào ở ngay</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-semibold text-emerald-100">
                        Đã duyệt
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-blue-100">
                      <span>92 m²</span>
                      <span>2 phòng ngủ</span>
                      <span>Cần bán</span>
                    </div>
                  </div>

                  <form action="/properties" method="get" className="rounded-2xl bg-white p-3 text-slate-950 shadow-xl">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input name="city" placeholder="Thử tìm Hà Nội hoặc Hồ Chí Minh" className="h-12 rounded-xl pl-9" />
                      </div>
                      <Button type="submit" className="h-12 rounded-xl px-5">
                        Tìm kiếm
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-4 w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <form action="/properties" method="get" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <div className="space-y-2">
              <label htmlFor="home-keyword" className="text-sm font-semibold text-slate-800">
                Bạn đang tìm kiếm gì?
              </label>
              <Input id="home-keyword" name="keyword" placeholder="Tiêu đề, địa chỉ, từ khóa mô tả..." className="h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
              <label htmlFor="home-city" className="text-sm font-semibold text-slate-800">
                Thành phố / Tỉnh
              </label>
              <Input id="home-city" name="city" placeholder="Hà Nội" className="h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
              <label htmlFor="home-purpose" className="text-sm font-semibold text-slate-800">
                Nhu cầu
              </label>
              <select
                id="home-purpose"
                name="purpose"
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Tất cả nhu cầu</option>
                <option value="sale">Mua bán</option>
                <option value="rent">Cho thuê</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="home-type" className="text-sm font-semibold text-slate-800">
                Loại hình
              </label>
              <select
                id="home-type"
                name="type"
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Tất cả loại hình</option>
                <option value="apartment">Căn hộ / Chung cư</option>
                <option value="house">Nhà nguyên căn</option>
                <option value="land">Đất nền</option>
                <option value="villa">Biệt thự</option>
                <option value="office">Văn phòng</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="h-12 w-full rounded-xl px-6">
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickSearches.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${item.tone}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </form>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Tin đăng nổi bật</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Khám phá các bất động sản vừa được duyệt</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Xem nhanh danh sách các căn hộ, nhà đất mới nhất trên sàn. Bạn có thể chuyển sang trang xem toàn bộ danh sách để áp dụng các bộ lọc nâng cao hơn.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/properties">
              Xem tất cả danh sách
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredError ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <p className="font-semibold">Mục tin đăng nổi bật tạm thời không khả dụng.</p>
            <p className="mt-2 text-sm leading-6">
              {featuredError} Vui lòng kiểm tra lại dịch vụ Backend hoặc cấu hình biến môi trường `NEXT_PUBLIC_API_URL`, sau đó làm mới lại trang này.
            </p>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Building2 className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">Chưa có bất động sản nào được duyệt</h3>
            <p className="mt-2 text-sm text-slate-600">Hãy thử tạo mới hoặc phê duyệt các tin đăng đang chờ xử lý để khu vực này hoạt động.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Về RealEstateHub</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Thiết kế tối ưu cho những quyết định nhà đất lớn.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Thị trường bất động sản cần một trải nghiệm rõ ràng, minh bạch và an toàn. Mọi tính năng cốt lõi trên nền tảng của chúng tôi đều trực quan, dễ tiếp cận trên cả máy tính lẫn thiết bị di động.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-400/15 text-blue-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Tích hợp trọn vẹn vai trò</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Một hệ thống, ba luồng quy trình rõ ràng.</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {roleCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}