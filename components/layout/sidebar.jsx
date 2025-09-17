"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";

// Modernize-styled Sidebar supporting vertical and horizontal layouts
// Pass layout="vertical" | "horizontal" and items=[{ name, href, iconClass, permission, children?: [...] }]

export function Sidebar({ layout = "vertical", items = [] }) {
  const pathname = usePathname();
  const { checkPermission } = usePermissions();

  const renderItem = (item) => {
    const isActive = pathname === item.href;
    const hasPermission = !item.permission || checkPermission(item.permission);
    if (!hasPermission) return null;

    if (item.children && item.children.length > 0) {
      return (
        <li className="sidebar-item" key={item.name}>
          <button
            className="sidebar-link has-arrow"
            type="button"
            aria-expanded="false"
            onClick={(e) => {
              e.preventDefault();
              const target = e.currentTarget;
              const isExpanded = target.getAttribute('aria-expanded') === 'true';
              target.setAttribute('aria-expanded', !isExpanded);
              const ul = target.nextElementSibling;
              if (ul) {
                ul.classList.toggle('show');
              }
            }}
          >
            <span className="d-flex">
              {item.iconClass ? (
                <i className={item.iconClass}></i>
              ) : (
                <i className="ti ti-circle"></i>
              )}
            </span>
            <span className="hide-menu">{item.name}</span>
          </button>
          <ul aria-expanded="false" className="collapse first-level">
            {item.children.map((child) =>
              renderItem({ ...child, isChild: true })
            )}
          </ul>
        </li>
      );
    }

    return (
      <li className="sidebar-item" key={item.name}>
        <Link className="sidebar-link" href={item.href} aria-expanded="false">
          <span>
            {item.iconClass ? (
              <i className={item.iconClass}></i>
            ) : (
              <i className="ti ti-circle"></i>
            )}
          </span>
          <span className="hide-menu">{item.name}</span>
        </Link>
      </li>
    );
  };

  if (layout === "horizontal") {
    return (
      <nav
        id="sidebarnavh"
        className="sidebar-nav scroll-sidebar container-fluid"
      >
        <ul id="sidebarnav">{items.map((item) => renderItem(item))}</ul>
      </nav>
    );
  }

  return (
    <nav className="sidebar-nav scroll-sidebar" data-simplebar>
      <ul id="sidebarnav">{items.map((item) => renderItem(item))}</ul>
    </nav>
  );
}
