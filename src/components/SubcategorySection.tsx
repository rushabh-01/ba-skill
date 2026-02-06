import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ConceptCard } from "./ConceptCard";
import { cn } from "@/lib/utils";

interface SubcategorySectionProps {
  subcategory: any;
  searchQuery: string;
}

export const SubcategorySection = ({ subcategory, searchQuery }: SubcategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredConcepts = subcategory.concepts?.filter((concept: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      concept.name.toLowerCase().includes(query) ||
      concept.short_description?.toLowerCase().includes(query)
    );
  });

  if (!filteredConcepts || filteredConcepts.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-border to-transparent" />
      
      {/* Subcategory header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group w-full text-left"
      >
        <div className={cn(
          "w-6 h-6 rounded-md bg-muted/50 flex items-center justify-center transition-transform duration-200",
          isExpanded && "rotate-90"
        )}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
          {subcategory.name}
        </span>
        
        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {filteredConcepts.length}
        </span>
      </button>

      {/* Concepts grid */}
      {isExpanded && (
        <div className="ml-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 stagger-children">
          {filteredConcepts.map((concept: any) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      )}
    </div>
  );
};
