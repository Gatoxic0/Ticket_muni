export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  requesterName: string;  
  requesterEmail: string;  
  assignee?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
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
