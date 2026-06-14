"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PropertyListParams } from "@/types/property";

interface PropertyFilterProps {
  values: PropertyListParams;
}

export function PropertyFilter({ values }: PropertyFilterProps) {
  return (
    <form className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm" action="/properties">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="keyword">Tìm kiếm</Label>
          <Input id="keyword" name="keyword" defaultValue={values.keyword ?? ""} placeholder="Tiêu đề, địa chỉ, mô tả..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Tỉnh / Thành phố</Label>
          <Input id="city" name="city" defaultValue={values.city ?? ""} placeholder="Hà Nội, Hồ Chí Minh..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Quận / Huyện</Label>
          <Input id="district" name="district" defaultValue={values.district ?? ""} placeholder="Nhập quận, huyện..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Loại bất động sản</Label>
          <select
            id="type"
            name="type"
            defaultValue={values.type ?? ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="">Tất cả các loại</option>
            <option value="apartment">Căn hộ / Chung cư</option>
            <option value="house">Nhà ở</option>
            <option value="land">Đất nền</option>
            <option value="villa">Biệt thự</option>
            <option value="office">Văn phòng</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Mục đích</Label>
          <select
            id="purpose"
            name="purpose"
            defaultValue={values.purpose ?? ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="">Tất cả nhu cầu</option>
            <option value="sale">Bán</option>
            <option value="rent">Cho thuê</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPrice">Giá tối thiểu</Label>
          <Input id="minPrice" name="minPrice" type="number" min="0" placeholder="Từ mức giá..." defaultValue={values.minPrice ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Giá tối đa</Label>
          <Input id="maxPrice" name="maxPrice" type="number" min="0" placeholder="Đến mức giá..." defaultValue={values.maxPrice ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minArea">Diện tích tối thiểu (m²)</Label>
          <Input id="minArea" name="minArea" type="number" min="0" placeholder="Từ m²..." defaultValue={values.minArea ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxArea">Diện tích tối đa (m²)</Label>
          <Input id="maxArea" name="maxArea" type="number" min="0" placeholder="Đến m²..." defaultValue={values.maxArea ?? ""} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button type="submit">
          <Search className="h-4 w-4" />
          Áp dụng bộ lọc
        </Button>
        <Button asChild type="button" variant="ghost">
          <a href="/properties">Đặt lại</a>
        </Button>
      </div>
    </form>
  );
}