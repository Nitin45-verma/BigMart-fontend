# Support API Contract

All routes documented here require an authenticated user with `role="admin"`. 
These align with the endpoints exposed under `/api/v1/admin/support/*`.

## Admin Support/Helpdesk Routes

- **GET /stats**: Get summary stats for support tickets.
- **GET /tickets**: List tickets with filtering.
- **GET /tickets/:ticketId**: View specific ticket details.
- **POST /tickets/:ticketId/messages**: Add a reply/message to a ticket.
- **PATCH /tickets/:ticketId/status**: Update ticket status.
- **PATCH /tickets/:ticketId/priority**: Update ticket priority.
- **PATCH /tickets/:ticketId/assign**: Assign a ticket to an admin user.
- **PATCH /tickets/:ticketId/escalate**: Escalate a ticket.
- **PATCH /tickets/:ticketId/resolve**: Mark ticket as resolved.
- **PATCH /tickets/:ticketId/close**: Close a ticket.
