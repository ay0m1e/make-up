import type { Service } from "../core/types";

export const SERVICE_CATEGORY_ORDER = [
  "Bridal packages",
  "Glee signature glam sessions",
  "Makeup Class packages",
] as const;

export type ServiceCategoryHeading = (typeof SERVICE_CATEGORY_ORDER)[number];

type ServiceCategoryDetails = {
  description: string;
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
};

const SERVICE_CATEGORY_DETAILS: Record<
  ServiceCategoryHeading,
  ServiceCategoryDetails
> = {
  "Bridal packages": {
    description:
      "Bridal makeup and hair packages shaped for calm mornings, polished ceremonies, and a seamless finish from first look to final touch.",
    ctaLabel: "Explore bridal packages",
    imageSrc: "/images/stack/stack-1.jpg",
    imageAlt: "Bridal beauty service preview",
  },
  "Glee signature glam sessions": {
    description:
      "Refined studio, home, editorial, and occasion makeup sessions for clients who want soft glam that feels elevated and easy to wear.",
    ctaLabel: "Explore glam sessions",
    imageSrc: "/images/stack/stack-3.jpg",
    imageAlt: "Signature glam service preview",
  },
  "Makeup Class packages": {
    description:
      "Focused makeup classes designed to build technique, product confidence, and a polished finish that works with your features.",
    ctaLabel: "Explore makeup classes",
    imageSrc: "/images/stack/stack-5.jpg",
    imageAlt: "Makeup class service preview",
  },
};

export function getServiceCategoryHeading(
  service: Pick<Service, "name" | "category">,
): ServiceCategoryHeading {
  const rawCategory = service.category?.trim().toLowerCase() ?? "";
  const rawName = service.name.trim().toLowerCase();

  if (rawCategory.includes("bridal") || rawName.includes("bridal")) {
    return "Bridal packages";
  }

  if (
    rawCategory.includes("lesson") ||
    rawCategory.includes("class") ||
    rawName.includes("lesson") ||
    rawName.includes("class")
  ) {
    return "Makeup Class packages";
  }

  return "Glee signature glam sessions";
}

export function normalizeServiceCategory(
  value: string | null | undefined,
): ServiceCategoryHeading | null {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue) {
    return null;
  }

  return (
    SERVICE_CATEGORY_ORDER.find(
      (category) => category.toLowerCase() === normalizedValue,
    ) ?? null
  );
}

export function getServiceCategoryDetails(category: ServiceCategoryHeading) {
  return SERVICE_CATEGORY_DETAILS[category];
}

export function getBookServicePath(
  service: Pick<Service, "name" | "category"> | null | undefined,
) {
  if (!service) {
    return "/services";
  }

  const category = getServiceCategoryHeading(service);
  return `/book/service?category=${encodeURIComponent(category)}`;
}
