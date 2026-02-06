import { useState, useEffect } from "react";
import { SkillMap } from "@/components/SkillMap";
import { SearchBar } from "@/components/SearchBar";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Auto-populate data on first load if database is empty
  useEffect(() => {
    const checkAndPopulate = async () => {
      const { count } = await supabase.from("categories").select("*", { count: "exact", head: true });

      if (count === 0) {
        // Database is empty, populate it
        await fetch("https://nrppwonkfkjcwfzirndb.supabase.co/functions/v1/populate-skills", {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycHB3b25rZmtqY3dmemlybmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzMzMTgsImV4cCI6MjA3OTEwOTMxOH0.Wd85gBY_Zy9-JC4VsOrL7FDIKGrrO50iqAD52YA0TOw`,
            "Content-Type": "application/json",
          },
        });
      }
    };

    checkAndPopulate();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background pattern */}
      <div className="fixed inset-0 pattern-dots pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      
      {/* Decorative gradient orbs */}
      <div className="fixed top-[20%] left-[10%] w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <Navbar />
        <Hero />

        <main id="search" className="container mx-auto px-4 py-10 max-w-[1800px]">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <div id="skills-map">
            <SkillMap searchQuery={searchQuery} selectedCategory={selectedCategory} />
          </div>
        </main>

        <footer className="border-t border-border/50 py-8 mt-12 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <p className="font-handwriting text-xl text-muted-foreground">
              Built for Business Analysts, by Business Analysts
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Free forever • No login required
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
