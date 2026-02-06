import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategorySection } from "./CategorySection";
import { Loader2, FoldVertical, UnfoldVertical, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface SkillMapProps {
  searchQuery: string;
  selectedCategory: string | null;
}

export const SkillMap = ({ searchQuery, selectedCategory }: SkillMapProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(true);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          subcategories:subcategories(
            *,
            concepts:concepts(*)
          )
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      // Initialize all categories as expanded
      const ids = new Set(data?.map(c => c.id) || []);
      setExpandedCategories(ids);
      
      return data;
    },
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const ids = new Set(filteredCategories.map(c => c.id));
    setExpandedCategories(ids);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setAllExpanded(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading skills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-destructive">
        <AlertCircle className="h-10 w-10" />
        <p>Failed to load skills. Please refresh the page.</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No skills data available yet.</p>
      </div>
    );
  }

  // Filter categories based on search and selected category
  const filteredCategories = categories
    .filter((category) => {
      if (selectedCategory && category.name !== selectedCategory) {
        return false;
      }

      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      const matchesCategory = category.name.toLowerCase().includes(query);
      
      const matchesSubcategory = category.subcategories?.some((sub: any) =>
        sub.name.toLowerCase().includes(query)
      );

      const matchesConcept = category.subcategories?.some((sub: any) =>
        sub.concepts?.some((concept: any) =>
          concept.name.toLowerCase().includes(query) ||
          concept.short_description?.toLowerCase().includes(query)
        )
      );

      return matchesCategory || matchesSubcategory || matchesConcept;
    });

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredCategories.length}</span> categories
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={expandAll}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <UnfoldVertical className="h-4 w-4" />
            <span className="hidden sm:inline">Expand All</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <FoldVertical className="h-4 w-4" />
            <span className="hidden sm:inline">Collapse All</span>
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            searchQuery={searchQuery}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No results found for "<span className="text-primary">{searchQuery}</span>"
          </p>
        </div>
      )}
    </div>
  );
};
