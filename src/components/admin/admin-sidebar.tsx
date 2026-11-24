"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  ExternalLink,
  FolderTree,
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareQuote,
  Settings,
  Store,
  Wrench,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/site/logo";
import { logoutAction } from "@/server/actions/admin";

type NavItem = { href: string; label: string; Icon: typeof Inbox; exact?: boolean; badge?: boolean };

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Vendas",
    items: [
      { href: "/admin", label: "Painel", Icon: LayoutDashboard, exact: true },
      { href: "/admin/leads", label: "Pedidos de orçamento", Icon: Inbox, badge: true },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/produtos", label: "Produtos", Icon: Boxes },
      { href: "/admin/categorias", label: "Categorias", Icon: FolderTree },
      { href: "/admin/servicos", label: "Serviços", Icon: Wrench },
    ],
  },
  {
    label: "Conteúdo do site",
    items: [
      { href: "/admin/promocoes", label: "Faixa de campanha", Icon: Megaphone },
      { href: "/admin/projetos", label: "Projetos (galeria)", Icon: Images },
      { href: "/admin/depoimentos", label: "Depoimentos", Icon: MessageSquareQuote },
      { href: "/admin/posts", label: "Dicas (blog)", Icon: BookOpen },
      { href: "/admin/faqs", label: "Perguntas frequentes", Icon: HelpCircle },
    ],
  },
  {
    label: "Empresa",
    items: [
      { href: "/admin/lojas", label: "Lojas e horários", Icon: Store },
      { href: "/admin/configuracoes", label: "Configurações", Icon: Settings },
    ],
  },
];

export function AdminSidebar({ newLeads, userName }: { newLeads: number; userName: string }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <Link href="/admin" onClick={() => setOpenMobile(false)}>
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {GROUPS.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map(({ href, label, Icon, exact, badge }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isActive(href, exact)} size="lg" className="h-10">
                      <Link href={href} onClick={() => setOpenMobile(false)}>
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {badge && newLeads > 0 && (
                      <SidebarMenuBadge className="bg-sun-500 text-ink" aria-label={`${newLeads} novos`}>
                        {newLeads}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-1 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" /> <span>Ver o site</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logoutAction}>
              <SidebarMenuButton type="submit">
                <LogOut aria-hidden="true" /> <span>Sair ({userName})</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
