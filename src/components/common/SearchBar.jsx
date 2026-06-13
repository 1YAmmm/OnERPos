import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

export function SearchBar({ placeholder = 'Search…', value, onChange, className }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={cn(
      'flex items-center gap-2 glass rounded-xl px-3 py-2 transition-all duration-200',
      focused && 'border-indigo-500/40 bg-white/6',
      className
    )}>
      <Search className="w-4 h-4 text-white/30 shrink-0" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/25 outline-none min-w-0"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-white/30 hover:text-white/60 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
