import Image, { type ImageProps } from "next/image";

/** next/image that skips the optimizer for external hosts not in the allow-list. */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const external = src.startsWith("http") && !src.startsWith("https://images.unsplash.com/");
  return <Image {...props} unoptimized={props.unoptimized ?? external} alt={props.alt} />;
}
