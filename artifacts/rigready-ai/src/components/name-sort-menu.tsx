import { ArrowUpDown, ChevronDown } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type NameSort = 'name-asc' | 'name-desc';

export function NameSortMenu({ value, onChange, label }: {
  value: NameSort;
  onChange: (value: NameSort) => void;
  label: string;
}) {
  const selected = value === 'name-asc' ? 'Name: A–Z' : 'Name: Z–A';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="software-sort-button" aria-label={`${label}: ${selected}`}>
          <ArrowUpDown size={15} aria-hidden="true" /><span>Sort: {selected}</span><ChevronDown size={14} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="software-sort-menu">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as NameSort)} aria-label={label}>
          <DropdownMenuRadioItem value="name-asc">Name: A–Z</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">Name: Z–A</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
