import { CategorySkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <span className="sr-only">กำลังโหลด...</span>
      <CategorySkeleton />
    </>
  );
}
