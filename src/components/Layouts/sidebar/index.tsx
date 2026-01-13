"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getNavData } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { useUiTranslations } from "@/hooks/use-ui-translations";
import { useTour } from "@/contexts/tour-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const translations = useUiTranslations();
  const { isTourActive, currentStep, steps } = useTour();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const NAV_DATA = getNavData(translations);

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        const itemKey = `${section.label}-${item.title}`;
        return item.items.some((subItem) => {
          // Check if subItem has nested items
          if ('items' in subItem && subItem.items && subItem.items.length > 0) {
            const subItemKey = `${itemKey}-${subItem.title}`;
            return subItem.items.some((nestedItem) => {
              if (nestedItem.url && nestedItem.url === pathname) {
                if (!expandedItems.includes(itemKey)) {
                  setExpandedItems((prev) => [...prev, itemKey]);
                }
                if (!expandedItems.includes(subItemKey)) {
                  setExpandedItems((prev) => [...prev, subItemKey]);
                }
                return true;
              }
              return false;
            });
          } else if (subItem.url && subItem.url === pathname) {
            if (!expandedItems.includes(itemKey)) {
              setExpandedItems((prev) => [...prev, itemKey]);
            }
            return true;
          }
          return false;
        });
      });
    });
  }, [pathname]);

  // Expandir automáticamente el dropdown de Autenticación cuando el tour está en ese paso
  useEffect(() => {
    if (isTourActive && steps.length > 0) {
      const currentStepData = steps[currentStep];
      if (currentStepData && (currentStepData.target === "tour-product-auth" || currentStepData.target === "tour-geolocalization")) {
        // Buscar el item de Autenticación en los datos de navegación
        NAV_DATA.forEach((section) => {
          section.items.forEach((item) => {
            if (item.title === translations.sidebar.menuItems.auth) {
              const itemKey = `${section.label}-${item.title}`;
              setExpandedItems((prev) => {
                if (!prev.includes(itemKey)) {
                  return [...prev, itemKey];
                }
                return prev;
              });
            }
          });
        });
      }
    }
  }, [isTourActive, currentStep, steps, translations.sidebar.menuItems.auth, NAV_DATA]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        data-tour-id="tour-sidebar"
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
          isTourActive && "z-[102]"
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
        style={isTourActive ? { zIndex: 102 } : undefined}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">{translations.sidebar.closeMenu}</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {NAV_DATA.map((section) => (
              <div
                key={section.label}
                className="mb-6"
                data-tour-id={
                  section.label === translations.sidebar.products
                    ? "tour-products-section"
                    : undefined
                }
              >
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => {
                      const itemKey = `${section.label}-${item.title}`;
                      const isItemExpanded = expandedItems.includes(itemKey);
                      const isItemActive = 
                        ("url" in item && item.url === pathname) ||
                        item.items.some((subItem) => {
                          if (subItem.url && subItem.url === pathname) return true;
                          if ('items' in subItem && subItem.items) {
                            return subItem.items.some((nestedItem) => nestedItem.url === pathname);
                          }
                          return false;
                        });

                      return (
                        <li
                          key={item.title}
                          data-tour-id={
                            item.title === translations.sidebar.menuItems.auth
                              ? "tour-product-auth"
                              : undefined
                          }
                        >
                          {item.items.length ? (
                            <div>
                              <MenuItem
                                isActive={isItemActive}
                                onClick={() => toggleExpanded(itemKey)}
                              >
                                {item.title === "AI" ? (
                                  <img
                                    src="/images/iconAlaiza.svg"
                                    alt="AI"
                                    className="size-6 shrink-0 rounded-full"
                                  />
                                ) : (
                                  <item.icon
                                    className="size-6 shrink-0 text-blue-600 dark:text-blue-400"
                                    aria-hidden="true"
                                  />
                                )}

                                <span>{item.title}</span>

                                <ChevronUp
                                  className={cn(
                                    "ml-auto rotate-180 transition-transform duration-200",
                                    isItemExpanded && "rotate-0",
                                  )}
                                  aria-hidden="true"
                                />
                              </MenuItem>

                              {isItemExpanded && (
                                <ul
                                  className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                  role="menu"
                                >
                                  {item.items.map((subItem) => {
                                    const subItemKey = `${itemKey}-${subItem.title}`;
                                    const isSubItemExpanded = expandedItems.includes(subItemKey);
                                    const hasNestedItems = 'items' in subItem && subItem.items && subItem.items.length > 0;
                                    const isSubItemActive = hasNestedItems
                                      ? subItem.items!.some((nestedItem) => nestedItem.url === pathname)
                                      : subItem.url === pathname;

                                    return (
                                      <li
                                        key={subItem.title}
                                        role="none"
                                        data-tour-id={
                                          subItem.title === translations.sidebar.menuItems.subItems.authentication
                                            ? "tour-auth-authentication"
                                            : subItem.title === translations.sidebar.menuItems.subItems.geolocalization
                                            ? "tour-geolocalization"
                                            : undefined
                                        }
                                      >
                                        {hasNestedItems ? (
                                          <div>
                                            <MenuItem
                                              isActive={isSubItemActive}
                                              onClick={() => toggleExpanded(subItemKey)}
                                            >
                                              <span>{subItem.title}</span>
                                              <ChevronUp
                                                className={cn(
                                                  "ml-auto rotate-180 transition-transform duration-200",
                                                  isSubItemExpanded && "rotate-0",
                                                )}
                                                aria-hidden="true"
                                              />
                                            </MenuItem>
                                            {isSubItemExpanded && (
                                              <ul
                                                className="ml-6 mr-0 space-y-1.5 pb-[10px] pr-0 pt-2"
                                                role="menu"
                                              >
                                                {subItem.items.map((nestedItem) => (
                                                  <li key={nestedItem.title} role="none">
                                                    {nestedItem.url ? (
                                                      <MenuItem
                                                        as="link"
                                                        href={nestedItem.url}
                                                        isActive={pathname === nestedItem.url}
                                                      >
                                                        <span>{nestedItem.title}</span>
                                                      </MenuItem>
                                                    ) : (
                                                      <div className="rounded-lg px-3.5 py-2 font-medium text-dark-4 opacity-50 dark:text-dark-6">
                                                        <span>{nestedItem.title}</span>
                                                      </div>
                                                    )}
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </div>
                                        ) : subItem.url ? (
                                          <MenuItem
                                            as="link"
                                            href={subItem.url}
                                            isActive={pathname === subItem.url}
                                            data-tour-id={
                                              subItem.title === translations.sidebar.menuItems.subItems.authentication
                                                ? "tour-auth-authentication"
                                                : subItem.title === translations.sidebar.menuItems.subItems.geolocalization
                                                ? "tour-geolocalization"
                                                : undefined
                                            }
                                          >
                                            <span>{subItem.title}</span>
                                          </MenuItem>
                                        ) : (
                                          <div className="rounded-lg px-3.5 py-2 font-medium text-dark-4 opacity-50 dark:text-dark-6">
                                            <span>{subItem.title}</span>
                                          </div>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          ) : (
                            (() => {
                              const href =
                                "url" in item
                                  ? item.url + ""
                                  : "/" +
                                    item.title.toLowerCase().split(" ").join("-");

                              return (
                                <MenuItem
                                  className="flex items-center gap-3 py-3"
                                  as="link"
                                  href={href}
                                  isActive={pathname === href}
                                >
                                  <item.icon
                                    className="size-6 shrink-0 text-blue-600 dark:text-blue-400"
                                    aria-hidden="true"
                                  />

                                  <span>{item.title}</span>
                                </MenuItem>
                              );
                            })()
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
