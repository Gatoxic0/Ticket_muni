export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  requester: string;
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
  department: string;
  resolutionComment?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  urgent: number;
  high: number;
}
