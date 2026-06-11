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
          <Label htmlFor="keyword">Search</Label>
          <Input id="keyword" name="keyword" defaultValue={values.keyword ?? ""} placeholder="Title, address, description" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={values.city ?? ""} placeholder="Ha Noi, Ho Chi Minh" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input id="district" name="district" defaultValue={values.district ?? ""} placeholder="District" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            defaultValue={values.type ?? ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <select
            id="purpose"
            name="purpose"
            defaultValue={values.purpose ?? ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="">Any purpose</option>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPrice">Min price</Label>
          <Input id="minPrice" name="minPrice" type="number" min="0" defaultValue={values.minPrice ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input id="maxPrice" name="maxPrice" type="number" min="0" defaultValue={values.maxPrice ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minArea">Min area</Label>
          <Input id="minArea" name="minArea" type="number" min="0" defaultValue={values.minArea ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxArea">Max area</Label>
          <Input id="maxArea" name="maxArea" type="number" min="0" defaultValue={values.maxArea ?? ""} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button type="submit">
          <Search className="h-4 w-4" />
          Apply filters
        </Button>
        <Button asChild type="button" variant="ghost">
          <a href="/properties">Reset</a>
        </Button>
      </div>
    </form>
  );
}
