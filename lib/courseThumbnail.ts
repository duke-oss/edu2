import type { CSSProperties } from "react";

const TITLE_IMAGE_RULES: Array<{ keywords: string[]; image: string }> = [
  {
    keywords: ["통관", "관세", "fta"],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["물류", "배송", "운송", "해운"],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["소싱", "알리바바", "구매대행"],
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["입문", "기초", "시작"],
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
  },
  {
    keywords: ["무역", "실무", "수입"],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80";

export function isImageThumbnail(value?: string | null): boolean {
  if (!value) return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:image/")
  );
}

function getImageByTitle(title?: string): string {
  const normalized = (title ?? "").toLowerCase();
  for (const rule of TITLE_IMAGE_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) return rule.image;
  }
  return DEFAULT_IMAGE;
}

export function resolveCourseThumbnail(thumbnail?: string | null, title?: string): string {
  if (isImageThumbnail(thumbnail)) return thumbnail as string;
  return getImageByTitle(title);
}

export function getCourseThumbnailRenderProps(thumbnail?: string | null, title?: string): {
  className: string;
  style?: CSSProperties;
} {
  if (isImageThumbnail(thumbnail)) {
    return {
      className: "bg-cover bg-center bg-no-repeat bg-muted",
      style: { backgroundImage: `url(${thumbnail})` },
    };
  }

  const fallbackImage = getImageByTitle(title);
  return {
    className: "bg-cover bg-center bg-no-repeat bg-muted",
    style: { backgroundImage: `url(${fallbackImage})` },
  };
}
