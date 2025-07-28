import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface NavItemProps {
  href: string
  icon: LucideIcon
  title: string
  badge?: number | string
  onClick?: () => void
  variant?: "default" | "ghost" | "destructive"
}

export function NavItem({ 
  href, 
  icon: Icon, 
  title, 
  badge, 
  onClick,
  variant = "default" 
}: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === href
  
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent/10",
        isActive 
          ? "bg-accent/10 text-accent" 
          : "text-muted-foreground hover:text-accent",
        variant === "destructive" && "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
      {badge && (
        <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-white">
          {badge}
        </div>
      )}
    </Link>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItemProps[]
  title?: string
}

export function SidebarNav({ items, title, className, ...props }: SidebarNavProps) {
  if (!items.length) return null
  
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {title && (
        <h4 className="text-xs font-semibold text-accent mb-1 px-3">{title}</h4>
      )}
      <nav className="grid gap-1">
        {items.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </nav>
    </div>
  )
}