import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortKey } from "@/hooks/usePropertyFilters";

interface SortOption {
  value: string;
  label: string;
}

interface PropertySortProps {
  sortBy: SortKey;
  sortOptions: SortOption[];
  onSortChange: (value: SortKey) => void;
}

export default function PropertySort({
  sortBy,
  sortOptions,
  onSortChange,
}: PropertySortProps) {
  return (
    <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortKey)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
