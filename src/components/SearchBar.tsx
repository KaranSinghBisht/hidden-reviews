"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  initialQuery?: string;
}

export function SearchBar({ onSearch, loading, initialQuery = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q && !loading) onSearch(q);
      }}
      className="flex w-full gap-2"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search any product, place, or company…"
          className="pl-11"
          aria-label="Search"
        />
      </div>
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Digging…" : "Dig"}
      </Button>
    </form>
  );
}
