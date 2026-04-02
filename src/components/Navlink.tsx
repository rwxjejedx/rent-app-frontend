import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, to, ...props }, ref) => (
    <RouterNavLink
      ref={ref}
      to={to}
      className={({ isActive }) =>
        [className, isActive && activeClassName].filter(Boolean).join(" ")
      }
      {...props}
    />
  )
);

NavLink.displayName = "NavLink";
export { NavLink };
