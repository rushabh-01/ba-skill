import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  ChevronDown,
  ChevronRight,
  Globe,
  Smartphone,
  Github,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Home,
  Image,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AdSubmissionForm } from "@/components/AdSubmissionForm";

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
  status: "requested" | "approved";
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

// Color palette for categories
const categoryColors = [
  { bg: "hsl(var(--primary))", text: "white" },
  { bg: "hsl(var(--accent))", text: "white" },
  { bg: "hsl(142, 76%, 45%)", text: "white" },
  { bg: "hsl(38, 92%, 50%)", text: "black" },
  { bg: "hsl(280, 65%, 60%)", text: "white" },
  { bg: "hsl(340, 82%, 55%)", text: "white" },
];

const Products = () => {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Fetch approved ads
  const { data: ads } = useQuery({
    queryKey: ["approved-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_ads")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Ad[];
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("display_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch subcategories
  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subcategories").select("*").order("display_order");
      if (error) throw error;
      return data as Subcategory[];
    },
  });

  // Build tree structure
  const treeData = useMemo(() => {
    if (!categories || !subcategories || !ads) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    // Root node
    nodes.push({
      id: "root",
      type: "default",
      position: { x: 400, y: 0 },
      data: {
        label: (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-semibold">
            <Megaphone className="w-5 h-5" />
            BA Products & Projects
          </div>
        ),
      },
      style: { border: "none", background: "transparent" },
    });

    yOffset = 120;

    // Filter categories that have approved ads
    const categoriesWithAds = categories.filter((cat) => {
      const catSubs = subcategories.filter((s) => s.category_id === cat.id);
      return catSubs.some((sub) => ads.some((ad) => ad.subcategory_id === sub.id));
    });

    categoriesWithAds.forEach((cat, catIndex) => {
      const catNodeId = `cat-${cat.id}`;
      const color = categoryColors[catIndex % categoryColors.length];
      const isExpanded = expandedCategories.has(cat.id);
      const catSubs = subcategories.filter((s) => s.category_id === cat.id);
      const catAdsCount = catSubs.reduce(
        (acc, sub) => acc + ads.filter((ad) => ad.subcategory_id === sub.id).length,
        0,
      );

      // Category node
      nodes.push({
        id: catNodeId,
        type: "default",
        position: { x: 150 + catIndex * 200, y: yOffset },
        data: {
          label: (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: color.bg, color: color.text }}
              onClick={() => {
                setExpandedCategories((prev) => {
                  const next = new Set(prev);
                  if (next.has(cat.id)) next.delete(cat.id);
                  else next.add(cat.id);
                  return next;
                });
              }}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span className="font-medium">{cat.name}</span>
              <Badge variant="secondary" className="ml-1 bg-white/20 text-inherit border-none text-xs">
                {catAdsCount}
              </Badge>
            </div>
          ),
        },
        style: { border: "none", background: "transparent" },
      });

      // Edge from root to category
      edges.push({
        id: `e-root-${catNodeId}`,
        source: "root",
        target: catNodeId,
        style: { stroke: color.bg, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: color.bg },
      });

      if (isExpanded) {
        const subsWithAds = catSubs.filter((sub) => ads.some((ad) => ad.subcategory_id === sub.id));

        subsWithAds.forEach((sub, subIndex) => {
          const subNodeId = `sub-${sub.id}`;
          const subYOffset = yOffset + 100 + subIndex * 80;
          const isSubExpanded = expandedSubcategories.has(sub.id);
          const subAds = ads.filter((ad) => ad.subcategory_id === sub.id);

          // Subcategory node
          nodes.push({
            id: subNodeId,
            type: "default",
            position: { x: 150 + catIndex * 200, y: subYOffset },
            data: {
              label: (
                <div
                  className="w-fit flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:scale-105 bg-card border border-border/50"
                  style={{background:"slategray"}}
                  onClick={() => {
                    setExpandedSubcategories((prev) => {
                      const next = new Set(prev);
                      if (next.has(sub.id)) next.delete(sub.id);
                      else next.add(sub.id);
                      return next;
                    });
                  }}
                >
                  {isSubExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className="font-medium text-sm" style={{ color: "snow" }}>{sub.name}</span>
                  <Badge variant="outline" className="ml-1 text-xs">
                    {subAds.length}
                  </Badge>
                </div>
              ),
            },
            style: { border: "none", background: "transparent" },
          });

          // Edge from category to subcategory
          edges.push({
            id: `e-${catNodeId}-${subNodeId}`,
            source: catNodeId,
            target: subNodeId,
            style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1.5 },
          });

          if (isSubExpanded) {
            // Ad nodes
            subAds.forEach((ad, adIndex) => {
              const adNodeId = `ad-${ad.id}`;

              nodes.push({
                id: adNodeId,
                type: "default",
                position: { x: 350 + catIndex * 200, y: subYOffset + adIndex * 70 },
                data: {
                  label: (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-r from-card to-card/80 border border-primary/30 max-w-[200px]"
                      onClick={() => setSelectedAd(ad)}
                    >
                      {ad.image_url ? (
                        <img src={ad.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <Image className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium text-sm truncate" style={{ color: "darkblue" }}>{ad.title}</span>
                    </div>
                  ),
                },
                style: { border: "none", background: "transparent" },
              });

              edges.push({
                id: `e-${subNodeId}-${adNodeId}`,
                source: subNodeId,
                target: adNodeId,
                style: { stroke: "hsl(var(--primary) / 0.5)", strokeWidth: 1 },
              });
            });
          }
        });
      }
    });

    return { nodes, edges };
  }, [categories, subcategories, ads, expandedCategories, expandedSubcategories]);

  const [nodes, setNodes, onNodesChange] = useNodesState(treeData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(treeData.edges);

  // Update nodes when tree data changes
  useMemo(() => {
    setNodes(treeData.nodes);
    setEdges(treeData.edges);
  }, [treeData, setNodes, setEdges]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background */}
      <div className="fixed inset-0 pattern-dots pointer-events-none opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />
      <div className="fixed top-[20%] left-[10%] w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <h1 className="font-handwriting text-2xl md:text-3xl">BA Products & Projects</h1>
          </div>
          <AdSubmissionForm />
        </div>
      </header>

      {/* React Flow Canvas */}
      <div className="h-[calc(100vh-80px)] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.3}
          maxZoom={2}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
          <Controls showInteractive={false} className="bg-card/80 border border-border/50 rounded-lg overflow-hidden text-black" />

          <Panel position="top-right" className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (expandedCategories.size > 0) {
                  setExpandedCategories(new Set());
                  setExpandedSubcategories(new Set());
                } else if (categories) {
                  setExpandedCategories(new Set(categories.map((c) => c.id)));
                }
              }}
              className="bg-card/80 backdrop-blur text-purple-700"
            >
              {expandedCategories.size > 0 ? "Collapse All" : "Expand All"}
            </Button>
          </Panel>

          {(!ads || ads.length === 0) && (
            <Panel position="top-center" className="mt-20">
              <div className="text-center p-8 bg-card/80 backdrop-blur rounded-xl border border-border/50">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to showcase your BA tool or project!</p>
                <AdSubmissionForm />
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Ad Detail Dialog */}
      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
        <DialogContent className="max-w-lg bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedAd?.image_url && (
                <img src={selectedAd.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
              )}
              <span className="font-handwriting text-2xl">{selectedAd?.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedAd?.description && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
                <p className="text-foreground">{selectedAd.description}</p>
              </div>
            )}

            {selectedAd?.usecase && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Use Case</h4>
                <p className="text-foreground">{selectedAd.usecase}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {selectedAd?.web_link && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href={selectedAd.web_link} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4" />
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
              {selectedAd?.app_link && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href={selectedAd.app_link} target="_blank" rel="noopener noreferrer">
                    <Smartphone className="w-4 h-4" />
                    App
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
              {selectedAd?.github_link && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href={selectedAd.github_link} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
