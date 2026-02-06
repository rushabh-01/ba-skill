import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SubcategoryManager } from "@/components/admin/SubcategoryManager";
import { ConceptManager } from "@/components/admin/ConceptManager";
import { AdManager } from "@/components/admin/AdManager";
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft, Layers, FolderTree, Lightbulb, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background pattern */}
      <div className="fixed inset-0 pattern-dots pointer-events-none opacity-50" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />
      
      {/* Decorative gradient orbs */}
      <div className="fixed top-[10%] right-[20%] w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[30%] left-[10%] w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/ba-products">
                  <Button variant="outline" size="sm" className="gap-2 border-accent/30 hover:border-accent/50 hover:bg-accent/10">
                    <Megaphone className="w-4 h-4" />
                    Products
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10">
                    <Home className="w-4 h-4" />
                    View Site
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="font-handwriting text-5xl md:text-6xl text-foreground mb-2">
                  Content Management
                </h1>
                <p className="text-muted-foreground text-lg">
                  Create and organize your skill categories, subcategories, and concepts
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="concepts" className="w-full space-y-6 animate-fade-in">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-14 bg-card/50 backdrop-blur-sm border border-border/50 p-1.5 rounded-xl">
              <TabsTrigger 
                value="categories" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/30 data-[state=active]:border"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subcategories" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/30 data-[state=active]:border"
              >
                <FolderTree className="w-4 h-4" />
                <span className="hidden sm:inline">Subcategories</span>
              </TabsTrigger>
              <TabsTrigger 
                value="concepts" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/30 data-[state=active]:border"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Concepts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ads" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:border-accent/30 data-[state=active]:border"
              >
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">Ads</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="animate-fade-in">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="subcategories" className="animate-fade-in">
              <SubcategoryManager />
            </TabsContent>

            <TabsContent value="concepts" className="animate-fade-in">
              <ConceptManager />
            </TabsContent>

            <TabsContent value="ads" className="animate-fade-in">
              <AdManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
