import { useState } from "react";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { SubcategorySection } from "./SubcategorySection";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  category: any;
  searchQuery: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CategorySection = ({ category, searchQuery, isExpanded, onToggle }: CategorySectionProps) => {
  // Count total concepts
  const totalConcepts = category.subcategories?.reduce(
    (acc: number, sub: any) => acc + (sub.concepts?.length || 0),
    0
  ) || 0;

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300",
      isExpanded ? "shadow-lg" : "shadow-sm hover:shadow-md"
    )}>
      {/* Category header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-card/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          
          <div className="text-left">
            <h2 className="font-handwriting text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {totalConcepts} skills • {category.subcategories?.length || 0} subcategories
            </p>
          </div>
        </div>
        
        <div className={cn(
          "w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center transition-transform duration-300",
          isExpanded && "rotate-180"
        )}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </button>

      {/* Subcategories content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 space-y-4 animate-fade-in">
          {category.subcategories?.map((subcategory: any) => (
            <SubcategorySection
              key={subcategory.id}
              subcategory={subcategory}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};
