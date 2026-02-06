import { Search, X, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export const SearchBar = ({ value, onChange, onCategorySelect, selectedCategory }: SearchBarProps) => {
  const categories = [
    { name: "All", icon: "✨" },
    { name: "Frameworks", icon: "🧩" },
    { name: "Tools", icon: "🛠️" },
    { name: "Statistics & Mathematics", icon: "📊" },
    { name: "Product Management", icon: "🎯" },
    { name: "Project Management", icon: "📋" },
    { name: "Business Process Design", icon: "⚙️" }
  ];

  return (
    <div className="mb-10 space-y-6">
      {/* Search input */}
      <div className="relative max-w-2xl mx-auto group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search frameworks, tools, methodologies..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-12 pr-12 h-14 text-lg bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary/50 focus-visible:ring-primary/20 rounded-xl shadow-lg"
          />
          {value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(({ name, icon }) => {
          const isSelected = name === "All" ? !selectedCategory : selectedCategory === name;
          return (
            <Button
              key={name}
              variant="ghost"
              size="sm"
              onClick={() => onCategorySelect(name === "All" ? null : name)}
              className={cn(
                "rounded-full px-4 py-2 h-auto border transition-all duration-300",
                isSelected
                  ? "bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
                  : "bg-card/50 border-border/50 text-muted-foreground hover:bg-card hover:text-foreground hover:border-border"
              )}
            >
              <span className="mr-1.5">{icon}</span>
              {name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
