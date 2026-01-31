import { NavLink } from "@/components/NavLink";
import { FileCheck } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2.5 font-heading font-semibold text-foreground transition-opacity hover:opacity-80">
          <FileCheck className="h-6 w-6 text-primary" />
          <span className="text-lg">ProofReceipt</span>
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            activeClassName="text-foreground font-medium"
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            activeClassName="text-foreground font-medium"
          >
            Create
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
