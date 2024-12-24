import { Input } from "@/components/ui/input-with-icon";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function TableSearch({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [term, setTerm] = useState<string>(
    searchParams.get("searchString")?.toString() ?? ""
  );

  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("searchString", term);
    } else {
      params.delete("searchString");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  const handleClearSearch = () => {
    setTerm("");
    handleSearch();
  };

  return (
    <Input
      placeholder={placeholder}
      className="h-8 md:w-[20vw] w-[40vw]"
      startIcon={Search}
      endIcon={term ? X : undefined}
      value={term}
      onChange={(e) => {
        setTerm(e.target.value);
        handleSearch();
      }}
      onEndIconClick={handleClearSearch}
    />
  );
}
