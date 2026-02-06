import { Brain, Workflow, Target, Lightbulb } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient" />
      
      {/* Flow pattern overlay */}
      <div className="absolute inset-0 pattern-flow opacity-50" />
      
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-[10%] w-20 h-20 rounded-full bg-accent-cyan/10 blur-2xl animate-float" />
      <div className="absolute bottom-10 right-[15%] w-32 h-32 rounded-full bg-accent-purple/10 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-1/2 left-[5%] w-16 h-16 rounded-full bg-accent-pink/10 blur-xl animate-float" style={{ animationDelay: '-4s' }} />

      <div className="container mx-auto px-4 py-16 md:py-20 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Handwriting style heading */}
          <h1 className="font-handwriting text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight">
            Master the Art of
            <span className="block text-gradient-primary">Business Analysis</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore frameworks, tools, and techniques used by top analysts. 
            <span className="text-foreground font-medium"> Learn by doing, not just reading.</span>
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: Brain, label: "Analytical Thinking", color: "accent-cyan" },
              { icon: Workflow, label: "Process Mapping", color: "accent-purple" },
              { icon: Target, label: "Goal-Oriented", color: "accent-orange" },
              { icon: Lightbulb, label: "Problem Solving", color: "accent-green" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full glass border-${color}/30 hover:border-${color}/50 transition-all duration-300 hover-scale-sm`}
              >
                <Icon className={`w-4 h-4 text-${color}`} />
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
