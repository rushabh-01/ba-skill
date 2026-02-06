import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Megaphone, Upload, Link, Github, Globe, Smartphone, Sparkles, X } from "lucide-react";

export const AdSubmissionForm = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [usecase, setUsecase] = useState("");
  const [appLink, setAppLink] = useState("");
  const [webLink, setWebLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // Fetch categories with subcategories
  const { data: categories } = useQuery({
    queryKey: ['categories-with-subcategories'],
    queryFn: async () => {
      const { data: cats, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      if (catError) throw catError;

      const { data: subs, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .order('display_order');
      if (subError) throw subError;

      return cats.map(cat => ({
        ...cat,
        subcategories: subs.filter(sub => sub.category_id === cat.id)
      }));
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUsecase("");
    setAppLink("");
    setWebLink("");
    setGithubLink("");
    setSubcategoryId("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    if (!subcategoryId) {
      toast({ title: "Please select a subcategory", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('ad-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('ad-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert ad
      const { error } = await supabase
        .from('user_ads')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          usecase: usecase.trim() || null,
          app_link: appLink.trim() || null,
          web_link: webLink.trim() || null,
          github_link: githubLink.trim() || null,
          image_url: imageUrl,
          subcategory_id: subcategoryId,
          status: 'requested'
        });

      if (error) throw error;

      toast({ 
        title: "🎉 Submission received!", 
        description: "Your product will be reviewed and published soon." 
      });
      
      resetForm();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['user-ads'] });

    } catch (error: any) {
      console.error('Error submitting ad:', error);
      toast({ 
        title: "Submission failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-accent/50 hover:border-accent hover:bg-accent/10 text-accent"
        >
          <Megaphone className="w-4 h-4" />
          <span className="hidden sm:inline">Advertise Your Product</span>
          <span className="sm:hidden">Advertise</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-handwriting text-2xl">
            <Sparkles className="w-6 h-6 text-accent" />
            Submit Your Product
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Product Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome BA Tool"
              className="bg-background/50 border-border/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what your product does..."
              rows={3}
              className="bg-background/50 border-border/50 resize-none"
            />
          </div>

          {/* Use Case */}
          <div className="space-y-2">
            <Label htmlFor="usecase" className="text-sm font-medium">
              Use Case
            </Label>
            <Textarea
              id="usecase"
              value={usecase}
              onChange={(e) => setUsecase(e.target.value)}
              placeholder="How does this help Business Analysts?"
              rows={2}
              className="bg-background/50 border-border/50 resize-none"
            />
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={subcategoryId} onValueChange={setSubcategoryId}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {categories?.map(cat => (
                  <div key={cat.id}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                      {cat.name}
                    </div>
                    {cat.subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Links</Label>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  value={webLink}
                  onChange={(e) => setWebLink(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="bg-background/50 border-border/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  value={appLink}
                  onChange={(e) => setAppLink(e.target.value)}
                  placeholder="App Store / Play Store link"
                  className="bg-background/50 border-border/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/yourproject"
                  className="bg-background/50 border-border/50"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Product Image</Label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border/50">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Megaphone className="w-4 h-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
