import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  BookOpen,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  Target,
  TrendingUp,
  Network,
  Scale,
  Layers,
  Play,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConceptModalProps {
  concept: any;
  isOpen: boolean;
  onClose: () => void;
}

// New tab structure - removed Job Roles
const tabConfigs = [
  {
    value: "overview",
    icon: Layers,
    title: "Overview",
    fields: ["short_description", "detailed_description"],
    color: "cyan",
  },
  {
    value: "application",
    icon: BookOpen,
    title: "Application",
    fields: ["how_to_perform"],
    color: "blue",
  },
  {
    value: "when_why",
    icon: Target,
    title: "When & Why",
    fields: ["when_to_use", "why_to_use"],
    color: "green",
  },
  {
    value: "best_practices",
    icon: CheckCircle2,
    title: "Best Practices",
    fields: ["best_practices", "pros_and_cons"],
    color: "purple",
  },
  {
    value: "examples",
    icon: TrendingUp,
    title: "Examples",
    fields: ["real_world_examples"],
    color: "orange",
  },
  {
    value: "resources",
    icon: ExternalLink,
    title: "Resources",
    fields: ["learning_resources", "useful_links", "related_concepts", "images"],
    color: "pink",
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    gradient: "from-green-500/20 to-green-600/5",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    gradient: "from-pink-500/20 to-pink-600/5",
  },
};

const ContentSection = ({ title, content, icon: Icon, color }: { title: string; content: string; icon: any; color: string }) => {
  const colors = colorClasses[color];
  
  return (
    <div className={cn(
      "p-4 rounded-xl border bg-gradient-to-br",
      colors.border,
      colors.gradient
    )}>
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("p-1.5 rounded-lg", colors.bg)}>
          <Icon className={cn("h-4 w-4", colors.text)} />
        </div>
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};

const ResourceCard = ({ title, url, type }: { title: string; url: string; type: string }) => {
  const getIcon = () => {
    if (type === 'video' || url.includes('youtube') || url.includes('vimeo')) return Play;
    return LinkIcon;
  };
  const Icon = getIcon();
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all group"
    >
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{url}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  );
};

export const ConceptModal = ({ concept, isOpen, onClose }: ConceptModalProps) => {
  // Find first available tab with content
  const getDefaultTab = () => {
    for (const tab of tabConfigs) {
      const hasContent = tab.fields.some(field => {
        if (field === 'images') return concept.images?.length > 0;
        return concept[field];
      });
      if (hasContent) return tab.value;
    }
    return "overview";
  };

  const renderTabContent = (tab: typeof tabConfigs[0]) => {
    const colors = colorClasses[tab.color];
    
    if (tab.value === "overview") {
      return (
        <div className="space-y-4">
          {concept.short_description && (
            <div className={cn(
              "p-4 rounded-xl border bg-gradient-to-br",
              colors.border,
              colors.gradient
            )}>
              <p className="text-foreground leading-relaxed">{concept.short_description}</p>
            </div>
          )}
          {concept.detailed_description && (
            <ContentSection
              title="Detailed Overview"
              content={concept.detailed_description}
              icon={Layers}
              color={tab.color}
            />
          )}
        </div>
      );
    }

    if (tab.value === "application") {
      return (
        <div className="space-y-4">
          {concept.how_to_perform && (
            <ContentSection
              title="How to Apply"
              content={concept.how_to_perform}
              icon={BookOpen}
              color={tab.color}
            />
          )}
          {/* Show images in application tab */}
          {concept.images && concept.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concept.images.map((imageUrl: string, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden border border-border/50">
                  <img
                    src={imageUrl}
                    alt={`${concept.name} illustration ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (tab.value === "when_why") {
      return (
        <div className="space-y-4">
          {concept.when_to_use && (
            <ContentSection
              title="When to Use"
              content={concept.when_to_use}
              icon={Target}
              color={tab.color}
            />
          )}
          {concept.why_to_use && (
            <ContentSection
              title="Why Use It"
              content={concept.why_to_use}
              icon={Lightbulb}
              color="green"
            />
          )}
        </div>
      );
    }

    if (tab.value === "best_practices") {
      return (
        <div className="space-y-4">
          {concept.best_practices && (
            <ContentSection
              title="Best Practices"
              content={concept.best_practices}
              icon={CheckCircle2}
              color={tab.color}
            />
          )}
          {concept.pros_and_cons && (
            <ContentSection
              title="Pros & Cons"
              content={concept.pros_and_cons}
              icon={Scale}
              color="purple"
            />
          )}
        </div>
      );
    }

    if (tab.value === "examples") {
      return (
        <div className="space-y-4">
          {concept.real_world_examples && (
            <ContentSection
              title="Real-World Examples"
              content={concept.real_world_examples}
              icon={TrendingUp}
              color={tab.color}
            />
          )}
        </div>
      );
    }

    if (tab.value === "resources") {
      return (
        <div className="space-y-6">
          {/* Learning Resources */}
          {concept.learning_resources && (
            <ContentSection
              title="Learning Resources"
              content={concept.learning_resources}
              icon={BookOpen}
              color={tab.color}
            />
          )}
          
          {/* Useful Links */}
          {concept.useful_links && (
            <ContentSection
              title="Useful Links"
              content={concept.useful_links}
              icon={ExternalLink}
              color="pink"
            />
          )}

          {/* Related Concepts */}
          {concept.related_concepts && (
            <ContentSection
              title="Related Concepts"
              content={concept.related_concepts}
              icon={Network}
              color="purple"
            />
          )}

          {/* Images gallery */}
          {concept.images && concept.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-pink-400" />
                Visual Resources
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {concept.images.map((imageUrl: string, index: number) => (
                  <div key={index} className="rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                    <img
                      src={imageUrl}
                      alt={`${concept.name} resource ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Check which tabs have content
  const availableTabs = tabConfigs.filter(tab => 
    tab.fields.some(field => {
      if (field === 'images') return concept.images?.length > 0;
      return concept[field];
    })
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border/50 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent">
          <DialogTitle className="font-handwriting text-4xl text-foreground">
            {concept.name}
          </DialogTitle>
          {concept.tags && concept.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {concept.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue={getDefaultTab()} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 border-b border-border/30">
            <TabsList className="w-full justify-start gap-1 bg-transparent p-0 h-auto flex-wrap">
              {availableTabs.map((tab) => {
                const colors = colorClasses[tab.color];
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      "data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent",
                      "data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50",
                      "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-6 py-4">
            {availableTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0 animate-fade-in">
                {renderTabContent(tab)}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
