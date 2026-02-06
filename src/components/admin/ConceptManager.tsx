import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, X, Filter, Search, Layers, BookOpen, Target, Image } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Concept = Tables<"concepts">;
type Subcategory = Tables<"subcategories">;
type Category = Tables<"categories">;

export const ConceptManager = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("");
  const [filterSubcategoryId, setFilterSubcategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    detailed_description: "",
    subcategory_id: "",
    how_to_perform: "",
    why_to_use: "",
    when_to_use: "",
    best_practices: "",
    real_world_examples: "",
    pros_and_cons: "",
    useful_links: "",
    related_concepts: "",
    learning_resources: "",
    tags: [] as string[],
    images: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchConcepts();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    setCategories(data || []);
  };

  const fetchSubcategories = async () => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .order("display_order");
    setSubcategories(data || []);
  };

  const fetchConcepts = async () => {
    const { data, error } = await supabase
      .from("concepts")
      .select("*")
      .order("name");
    
    if (error) {
      toast({ title: "Error fetching concepts", variant: "destructive" });
    } else {
      setConcepts(data || []);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('concept-images')
        .upload(filePath, file);

      if (uploadError) {
        toast({ title: "Error uploading image", variant: "destructive" });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('concept-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subcategory_id) {
      toast({ title: "Please select a subcategory", variant: "destructive" });
      return;
    }

    const dataToSubmit = {
      ...formData,
      tags: formData.tags.length > 0 ? formData.tags : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("concepts")
        .update(dataToSubmit)
        .eq("id", editingId);
      
      if (error) {
        toast({ title: "Error updating concept", variant: "destructive" });
      } else {
        toast({ title: "Concept updated successfully" });
        resetForm();
        fetchConcepts();
      }
    } else {
      const { error } = await supabase
        .from("concepts")
        .insert([dataToSubmit]);
      
      if (error) {
        toast({ title: "Error creating concept", variant: "destructive" });
      } else {
        toast({ title: "Concept created successfully" });
        resetForm();
        fetchConcepts();
      }
    }
  };

  const handleEdit = (concept: Concept) => {
    setEditingId(concept.id);
    setFormData({
      name: concept.name,
      short_description: concept.short_description || "",
      detailed_description: concept.detailed_description || "",
      subcategory_id: concept.subcategory_id,
      how_to_perform: concept.how_to_perform || "",
      why_to_use: concept.why_to_use || "",
      when_to_use: concept.when_to_use || "",
      best_practices: concept.best_practices || "",
      real_world_examples: concept.real_world_examples || "",
      pros_and_cons: concept.pros_and_cons || "",
      useful_links: concept.useful_links || "",
      related_concepts: concept.related_concepts || "",
      learning_resources: concept.learning_resources || "",
      tags: concept.tags || [],
      images: concept.images || [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this concept?")) return;
    
    const { error } = await supabase
      .from("concepts")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast({ title: "Error deleting concept", variant: "destructive" });
    } else {
      toast({ title: "Concept deleted successfully" });
      fetchConcepts();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      short_description: "",
      detailed_description: "",
      subcategory_id: "",
      how_to_perform: "",
      why_to_use: "",
      when_to_use: "",
      best_practices: "",
      real_world_examples: "",
      pros_and_cons: "",
      useful_links: "",
      related_concepts: "",
      learning_resources: "",
      tags: [],
      images: [],
    });
  };

  const getSubcategoryName = (subcategoryId: string) => {
    return subcategories.find(s => s.id === subcategoryId)?.name || "";
  };

  const filteredSubcategories = filterCategoryId
    ? subcategories.filter(sub => sub.category_id === filterCategoryId)
    : subcategories;

  const filteredConcepts = concepts.filter(concept => {
    if (filterSubcategoryId) {
      if (concept.subcategory_id !== filterSubcategoryId) return false;
    } else if (filterCategoryId) {
      const subcategoryIds = subcategories
        .filter(sub => sub.category_id === filterCategoryId)
        .map(sub => sub.id);
      if (!subcategoryIds.includes(concept.subcategory_id)) return false;
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        concept.name.toLowerCase().includes(search) ||
        concept.short_description?.toLowerCase().includes(search) ||
        concept.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return true;
  });

  const clearFilters = () => {
    setFilterCategoryId("");
    setFilterSubcategoryId("");
    setSearchTerm("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form Card */}
      <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 font-handwriting text-2xl">
            {editingId ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
            {editingId ? "Edit Concept" : "Create Concept"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/30 h-11 p-1 rounded-lg">
                <TabsTrigger value="basic" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Layers className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="details" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <BookOpen className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="learning" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Target className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="images" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Image className="w-4 h-4 mr-1.5 hidden sm:inline" />
                  Images
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="subcategory" className="text-muted-foreground">Subcategory</Label>
                  <Select
                    value={formData.subcategory_id}
                    onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name" className="text-muted-foreground">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="short_description" className="text-muted-foreground">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    rows={2}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="detailed_description" className="text-muted-foreground">Detailed Description</Label>
                  <Textarea
                    id="detailed_description"
                    value={formData.detailed_description}
                    onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="how_to_perform" className="text-muted-foreground">How to Apply / Perform</Label>
                  <Textarea
                    id="how_to_perform"
                    value={formData.how_to_perform}
                    onChange={(e) => setFormData({ ...formData, how_to_perform: e.target.value })}
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="when_to_use" className="text-muted-foreground">When to Use</Label>
                  <Textarea
                    id="when_to_use"
                    value={formData.when_to_use}
                    onChange={(e) => setFormData({ ...formData, when_to_use: e.target.value })}
                    rows={3}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="why_to_use" className="text-muted-foreground">Why Use It</Label>
                  <Textarea
                    id="why_to_use"
                    value={formData.why_to_use}
                    onChange={(e) => setFormData({ ...formData, why_to_use: e.target.value })}
                    rows={3}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="best_practices" className="text-muted-foreground">Best Practices</Label>
                  <Textarea
                    id="best_practices"
                    value={formData.best_practices}
                    onChange={(e) => setFormData({ ...formData, best_practices: e.target.value })}
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="pros_and_cons" className="text-muted-foreground">Pros and Cons</Label>
                  <Textarea
                    id="pros_and_cons"
                    value={formData.pros_and_cons}
                    onChange={(e) => setFormData({ ...formData, pros_and_cons: e.target.value })}
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="real_world_examples" className="text-muted-foreground">Real World Examples</Label>
                  <Textarea
                    id="real_world_examples"
                    value={formData.real_world_examples}
                    onChange={(e) => setFormData({ ...formData, real_world_examples: e.target.value })}
                    rows={4}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="learning" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="learning_resources" className="text-muted-foreground">Learning Resources</Label>
                  <Textarea
                    id="learning_resources"
                    value={formData.learning_resources}
                    onChange={(e) => setFormData({ ...formData, learning_resources: e.target.value })}
                    rows={4}
                    placeholder="Add learning resources, tutorials, courses..."
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="useful_links" className="text-muted-foreground">Useful Links</Label>
                  <Textarea
                    id="useful_links"
                    value={formData.useful_links}
                    onChange={(e) => setFormData({ ...formData, useful_links: e.target.value })}
                    rows={3}
                    placeholder="Add relevant URLs and resources..."
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="related_concepts" className="text-muted-foreground">Related Concepts</Label>
                  <Textarea
                    id="related_concepts"
                    value={formData.related_concepts}
                    onChange={(e) => setFormData({ ...formData, related_concepts: e.target.value })}
                    rows={2}
                    placeholder="List related concepts..."
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="images" className="text-muted-foreground">Upload Images</Label>
                  <div className="mt-2">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-border/50">
                        <img
                          src={url}
                          alt={`Concept image ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingId ? "Update Concept" : "Create Concept"}
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
            <Filter className="w-5 h-5 text-primary" />
            Existing Concepts
            <span className="ml-auto text-sm font-normal font-sans text-muted-foreground">
              {filteredConcepts.length} of {concepts.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select
                value={filterCategoryId}
                onValueChange={(value) => {
                  setFilterCategoryId(value === "all" ? "" : value);
                  setFilterSubcategoryId("");
                }}
              >
                <SelectTrigger className="bg-background/50 border-border/50 text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Subcategory</Label>
              <Select
                value={filterSubcategoryId}
                onValueChange={(value) => setFilterSubcategoryId(value === "all" ? "" : value)}
                disabled={!filterCategoryId}
              >
                <SelectTrigger className="bg-background/50 border-border/50 text-sm">
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(filterCategoryId || filterSubcategoryId || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredConcepts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  {(filterCategoryId || filterSubcategoryId || searchTerm) 
                    ? "No concepts found. Try adjusting your filters." 
                    : "No concepts yet. Create your first one!"}
                </p>
              </div>
            ) : (
              filteredConcepts.map((concept) => (
                <div
                  key={concept.id}
                  className={cn(
                    "flex items-start justify-between p-3 rounded-lg border border-border/50",
                    "bg-gradient-to-r from-card/80 to-muted/20 hover:from-primary/5 hover:to-accent/5",
                    "transition-all duration-200 group"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm mb-1">{concept.name}</div>
                    <div className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded inline-block">
                      {getSubcategoryName(concept.subcategory_id)}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(concept)}
                      className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(concept.id)}
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
