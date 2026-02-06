import { useState } from "react";
import { ConceptModal } from "./ConceptModal";
import { 
  Sparkles, Lightbulb, Target, TrendingUp, GitBranch, 
  BarChart3, Database, Code, Zap, FileText, Layers,
  PieChart, Users, Workflow, Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConceptCardProps {
  concept: any;
}

const icons = [
  Sparkles, Lightbulb, Target, TrendingUp, GitBranch, 
  BarChart3, Database, Code, Zap, FileText, Layers,
  PieChart, Users, Workflow, Brain
];

const colorClasses = [
  { bg: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]" },
  { bg: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/30", text: "text-purple-400", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]" },
  { bg: "from-orange-500/20 to-orange-600/10", border: "border-orange-500/30", text: "text-orange-400", glow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]" },
  { bg: "from-green-500/20 to-green-600/10", border: "border-green-500/30", text: "text-green-400", glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]" },
  { bg: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/30", text: "text-pink-400", glow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]" },
  { bg: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-400", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" },
  { bg: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/30", text: "text-yellow-400", glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]" },
  { bg: "from-red-500/20 to-red-600/10", border: "border-red-500/30", text: "text-red-400", glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]" },
  { bg: "from-teal-500/20 to-teal-600/10", border: "border-teal-500/30", text: "text-teal-400", glow: "group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]" },
  { bg: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-500/30", text: "text-indigo-400", glow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]" },
];

export const ConceptCard = ({ concept }: ConceptCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const colorIndex = Math.abs(concept.name.charCodeAt(0) + (concept.name.charCodeAt(1) || 0)) % colorClasses.length;
  const iconIndex = Math.abs(concept.name.charCodeAt(0)) % icons.length;
  const colors = colorClasses[colorIndex];
  const Icon = icons[iconIndex];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "group relative p-3 cursor-pointer rounded-xl border bg-gradient-to-br transition-all duration-300",
          "flex flex-col items-center justify-center min-h-[90px]",
          "hover:scale-[1.03] active:scale-[0.98]",
          colors.bg,
          colors.border,
          colors.glow
        )}
      >
        {/* Icon container */}
        <div className={cn(
          "w-10 h-10 rounded-lg bg-card/50 flex items-center justify-center mb-2",
          "group-hover:scale-110 transition-transform duration-300"
        )}>
          <Icon className={cn("h-5 w-5", colors.text)} />
        </div>
        
        {/* Title */}
        <h3 className="font-medium text-foreground text-center text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {concept.name}
        </h3>
      </button>

      <ConceptModal
        concept={concept}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
