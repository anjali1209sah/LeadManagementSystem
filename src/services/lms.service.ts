import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class LeadManagementService {
  // Create a new lead
  async createLead(data: { name: string; email: string; phone?: string }) {
    const lead = await prisma.leadCollection.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: "NEW",
      },
    });

    // Create activity log for the lead 
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        initialStatus: "NEW",
        updatedStatus: "NEW",
      },
    });

    return lead;
  }

  // Get lead by ID
  async getLeadById(leadId: number) {
    return await prisma.leadCollection.findUnique({
      where: { id: leadId },
      include: {
        ActivityLogs: true,
        FollowUps: true,
      },
    });
  }

  // Update lead details
  async updateLead(leadId: number, updates: Partial<{ name: string; email: string; phone: string }>) {
    return await prisma.leadCollection.update({
      where: { id: leadId },
      data: updates,
    });
  }

  // Update lead status
  async updateLeadStatus(leadId: number, status: string, action?: string, reason?: string) {
    const updatedLead = await prisma.leadCollection.update({
      where: { id: leadId },
      data: { status, lastAction: action },
    });

    // Log the status update
    await prisma.activityLog.create({
      data: {
        leadId,
        initialStatus: updatedLead.status,
        updatedStatus: status,
        action,
        reason,
      },
    });

    return updatedLead;
  }

  // Schedule a follow-up
  async scheduleFollowUp(leadId: number, nextFollowUpAt: Date) {
    return await prisma.followUp.create({
      data: {
        leadId,
        nextFollowUpAt,
        status: "IN_PROGRESS",
      },
    });
  }

  // Automated status update
  async automatedStatusUpdate() {
    const now = new Date();

    const requiresFollowUpLeads = await prisma.leadCollection.findMany({
      where: {
        status: "NEW",
        updatedAt: {
          lt: new Date(now.getTime() - 12 * 60 * 60 * 1000), 
        },
      },
    });

    for (const lead of requiresFollowUpLeads) {
      await this.updateLeadStatus(lead.id, "REQUIRES_FOLLOWUP", undefined, "No activity in 12 hours");
    }

    const staleLeads = await prisma.leadCollection.findMany({
      where: {
        status: "IN_PROGRESS",
        updatedAt: {
          lt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), 
        },
      },
    });

    for (const lead of staleLeads) {
      await this.updateLeadStatus(lead.id, "STALE", undefined, "No activity in 3 days");
    }
  }

  async getInactiveLeads(hours: number) {
    const thresholdDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await prisma.leadCollection.findMany({
      where: {
        updatedAt: { lte: thresholdDate },
        status: { notIn: ["CLOSED", "CONSULTATION_SCHEDULED"] },
      },
    });
  }

}

export default new LeadManagementService();
