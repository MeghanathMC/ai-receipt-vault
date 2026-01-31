import { NavLink } from "@/components/NavLink";
import { FileCheck } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2 font-heading font-semibold text-foreground">
          <FileCheck className="h-5 w-5 text-primary" />
          <span>ProofReceipt</span>
        </NavLink>
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground font-medium"
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground font-medium"
          >
            Create
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
