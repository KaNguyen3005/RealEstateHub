export interface GeocodingAddressInput {
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  label: string;
}

function buildAddressQuery(input: GeocodingAddressInput) {
  return [input.address, input.ward, input.district, input.city, "Vietnam"]
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

export async function geocodePropertyAddress(input: GeocodingAddressInput): Promise<GeocodingResult> {
  const query = buildAddressQuery(input);

  if (!query || query === "Vietnam") {
    throw new Error("Enter the property address and city before finding the location.");
  }

  const searchParams = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    countrycodes: "vn",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${searchParams.toString()}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error("Location lookup failed. Please try again or choose the marker on the map.");
  }

  const results = (await response.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;
  const firstResult = results[0];
  const latitude = Number(firstResult?.lat);
  const longitude = Number(firstResult?.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("No matching location was found. Choose the property location on the map.");
  }

  return {
    latitude,
    longitude,
    label: firstResult.display_name ?? query,
  };
}
