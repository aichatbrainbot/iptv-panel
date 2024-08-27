"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilter } from "@/types/search.types";
import { useQueryState } from "nuqs";

interface OrdersSearchProps {
  selectItems: {
    value: SearchFilter;
    label: string;
  }[];
}

const SearchBarAndFilters = ({ selectItems }: OrdersSearchProps) => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [filter, setFilter] = useQueryState("filter", {
    defaultValue: selectItems[0].value,
  });

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Input
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search orders"
      />
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-1/3">
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBarAndFilters;
