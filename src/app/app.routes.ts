import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/tickets",
    pathMatch: "full",
  },
  {
    path: "tickets",
    loadComponent: () => import("./pages/tickets/tickets.component").then((m) => m.TicketsComponent),
  },
  {
    path: "create-ticket",
    loadComponent: () => import("./pages/create-ticket/create-ticket.component").then((m) => m.CreateTicketComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },
  {
  path: "resolve-ticket/:id",
  loadComponent: () => import("./pages/resolve-ticket/resolve-ticket.component").then(m => m.ResolveTicketComponent),
}

]
