import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(points: number): string {
  return points.toLocaleString("id-ID");
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getFillColor(level: number): string {
  if (level >= 80) return "#ef4444"; // red
  if (level >= 50) return "#f59e0b"; // yellow
  return "#22c55e"; // green
}

export function getFillStatus(level: number): string {
  if (level >= 80) return "Penuh";
  if (level >= 50) return "Sedang";
  return "Normal";
}
