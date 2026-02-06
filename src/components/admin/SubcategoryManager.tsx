import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Search, FolderTree } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Subcategory = Tables<"subcategories">;
type Category = Tables<"categories">;

export const SubcategoryManager = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    display_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    setCategories(data || []);
  };

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .order("display_order");
    
    if (error) {
      toast({ title: "Error fetching subcategories", variant: "destructive" });
    } else {
      setSubcategories(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("subcategories")
        .update(formData)
        .eq("id", editingId);
      
      if (error) {
        toast({ title: "Error updating subcategory", variant: "destructive" });
      } else {
        toast({ title: "Subcategory updated successfully" });
        resetForm();
        fetchSubcategories();
      }
    } else {
      const { error } = await supabase
        .from("subcategories")
        .insert([formData]);
      
      if (error) {
        toast({ title: "Error creating subcategory", variant: "destructive" });
      } else {
        toast({ title: "Subcategory created successfully" });
        resetForm();
        fetchSubcategories();
      }
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingId(subcategory.id);
    setFormData({
      name: subcategory.name,
      description: subcategory.description || "",
      category_id: subcategory.category_id,
      display_order: subcategory.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    
    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast({ title: "Error deleting subcategory", variant: "destructive" });
    } else {
      toast({ title: "Subcategory deleted successfully" });
      fetchSubcategories();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", category_id: "", display_order: 0 });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "";
  };

  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(subcategory.category_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 font-handwriting text-2xl">
            {editingId ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
            {editingId ? "Edit Subcategory" : "Create Subcategory"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-muted-foreground">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background/50 border-border/50 focus:border-primary/50"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order" className="text-muted-foreground">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingId ? "Update Subcategory" : "Create Subcategory"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="border-border/50">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 font-handwriting text-2xl">
            <FolderTree className="w-5 h-5 text-primary" />
            Existing Subcategories
            <span className="ml-auto text-sm font-normal font-sans text-muted-foreground">
              {filteredSubcategories.length} of {subcategories.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredSubcategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  {searchTerm ? "No subcategories found." : "No subcategories yet. Create your first one!"}
                </p>
              </div>
            ) : (
              filteredSubcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border border-border/50",
                    "bg-gradient-to-r from-card/80 to-muted/20 hover:from-primary/5 hover:to-accent/5",
                    "transition-all duration-200 group"
                  )}
                >
                  <div>
                    <div className="font-medium text-foreground">{subcategory.name}</div>
                    <div className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded inline-block mt-1">
                      {getCategoryName(subcategory.category_id)}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(subcategory)}
                      className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(subcategory.id)}
                      className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
