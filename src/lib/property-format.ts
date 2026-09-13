export function formatPropertyType(type: string) {
  const types: Record<string, string> = {
    HOUSE: "Rumah",
    LAND: "Tanah",
    SHOPHOUSE: "Ruko",
    APARTMENT: "Apartemen",
    VILLA: "Villa",
    OFFICE: "Kantor",
  };

  return types[type] ?? type;
}

export function formatPropertyStatus(status: string) {
  const statuses: Record<string, string> = {
    AVAILABLE: "Tersedia",
    SOLD: "Terjual",
    RENTED: "Disewa",
  };

  return statuses[status] ?? status;
}

export function formatListingType(listingType: string) {
  const listingTypes: Record<string, string> = {
    SALE: "Dijual",
    RENT: "Disewa",
  };

  return listingTypes[listingType] ?? listingType;
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("id-ID").format(Number(price));
}