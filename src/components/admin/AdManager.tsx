import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Megaphone, Search, Edit, Trash2, Check, X, ExternalLink, 
  Globe, Smartphone, Github, Image, Clock, CheckCircle 
} from "lucide-react";

interface Ad {
  id: string;
  title: string;
  description: string | null;
  usecase: string | null;
  app_link: string | null;
  web_link: string | null;
  github_link: string | null;
  image_url: string | null;
  subcategory_id: string;
  status: 'requested' | 'approved';
  created_at: string;
  updated_at: string;
}

export const AdManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editForm, setEditForm] = useState<Partial<Ad>>({});

  const queryClient = useQueryClient();

  // Fetch ads
  const { data: ads, isLoading } = useQuery({
    queryKey: ['admin-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_ads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Ad[];
    }
  });

  // Fetch subcategories with categories
  const { data: subcategories } = useQuery({
    queryKey: ['subcategories-with-categories'],
    queryFn: async () => {
      const { data: subs, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .order('display_order');
      if (subError) throw subError;

      const { data: cats, error: catError } = await supabase
        .from('categories')
        .select('*');
      if (catError) throw catError;

      return subs.map(sub => ({
        ...sub,
        category: cats.find(c => c.id === sub.category_id)
      }));
    }
  });

  // Update ad mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ad> & { id: string }) => {
      const { error } = await supabase
        .from('user_ads')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] });
      queryClient.invalidateQueries({ queryKey: ['user-ads'] });
      toast({ title: "Ad updated successfully" });
      setEditingAd(null);
    },
    onError: (error: any) => {
      toast({ title: "Failed to update ad", description: error.message, variant: "destructive" });
    }
  });

  // Delete ad mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_ads')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] });
      queryClient.invalidateQueries({ queryKey: ['user-ads'] });
      toast({ title: "Ad deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete ad", description: error.message, variant: "destructive" });
    }
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'requested' | 'approved' }) => {
      const { error } = await supabase
        .from('user_ads')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] });
      queryClient.invalidateQueries({ queryKey: ['user-ads'] });
      toast({ title: "Status updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    }
  });

  const getSubcategoryName = (id: string) => {
    const sub = subcategories?.find(s => s.id === id);
    return sub ? `${sub.category?.name} → ${sub.name}` : 'Unknown';
  };

  const filteredAds = ads?.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesSubcategory = subcategoryFilter === 'all' || ad.subcategory_id === subcategoryFilter;
    return matchesSearch && matchesStatus && matchesSubcategory;
  }) || [];

  const requestedCount = ads?.filter(a => a.status === 'requested').length || 0;
  const approvedCount = ads?.filter(a => a.status === 'approved').length || 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ads?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requestedCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Approved & Live</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            Ad Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ads..."
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-background/50 border-border/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
              <SelectTrigger className="w-[200px] bg-background/50 border-border/50">
                <SelectValue placeholder="Subcategory" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">All Categories</SelectItem>
                {subcategories?.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(statusFilter !== 'all' || subcategoryFilter !== 'all' || searchTerm) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setSubcategoryFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Ads List */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No ads found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAds.map(ad => (
                <div 
                  key={ad.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg bg-muted/50 overflow-hidden shrink-0">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold truncate">{ad.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {getSubcategoryName(ad.subcategory_id)}
                        </p>
                      </div>
                      <Badge 
                        variant={ad.status === 'approved' ? 'default' : 'secondary'}
                        className={ad.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}
                      >
                        {ad.status === 'approved' ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    
                    {ad.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ad.description}
                      </p>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-3 mt-2">
                      {ad.web_link && (
                        <a href={ad.web_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {ad.app_link && (
                        <a href={ad.app_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <Smartphone className="w-4 h-4" />
                        </a>
                      )}
                      {ad.github_link && (
                        <a href={ad.github_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newStatus = ad.status === 'approved' ? 'requested' : 'approved';
                        toggleStatusMutation.mutate({ id: ad.id, status: newStatus });
                      }}
                      className={ad.status === 'approved' ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}
                    >
                      {ad.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingAd(ad);
                        setEditForm(ad);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Delete this ad?')) {
                          deleteMutation.mutate(ad.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingAd} onOpenChange={(open) => !open && setEditingAd(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Edit Ad</DialogTitle>
          </DialogHeader>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (editingAd) {
                updateMutation.mutate({ id: editingAd.id, ...editForm });
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="bg-background/50"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Use Case</Label>
              <Textarea
                value={editForm.usecase || ''}
                onChange={(e) => setEditForm({ ...editForm, usecase: e.target.value })}
                className="bg-background/50"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Web Link</Label>
              <Input
                value={editForm.web_link || ''}
                onChange={(e) => setEditForm({ ...editForm, web_link: e.target.value })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>App Link</Label>
              <Input
                value={editForm.app_link || ''}
                onChange={(e) => setEditForm({ ...editForm, app_link: e.target.value })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub Link</Label>
              <Input
                value={editForm.github_link || ''}
                onChange={(e) => setEditForm({ ...editForm, github_link: e.target.value })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={editForm.status || 'requested'} 
                onValueChange={(value: 'requested' | 'approved') => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => setEditingAd(null)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
