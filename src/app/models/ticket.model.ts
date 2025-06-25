export interface User {
  name: string
  email: string
  department: string
  role: "admin" | "user"
}
export type TicketStatus = "open" | "in-progress" | "resolved" | "closed"

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: "hardware" | "software" | "network" | "access";
  priority: "low" | "medium" | "high" | "urgent";
  status: TicketStatus;
  requester: string;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  department: string; // ← Añadido
  resolutionComment?: string
}


export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  urgent: number
  high: number
}
