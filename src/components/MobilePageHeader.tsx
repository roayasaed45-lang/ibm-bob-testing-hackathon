import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobilePageHeaderProps {
  title: string;
}

const MobilePageHeader = ({ title }: MobilePageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header
      className="border-b border-border bg-background"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="h-16 px-5 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{title}</h1>
          <p className="text-xs text-muted-foreground">Ale Barber</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">בית</span>
        </button>
      </div>
    </header>
  );
};

export default MobilePageHeader;
