import lmsService from "../services/lms.service";

const updateLeadStatuses = async () => {
  try {
    // Find leads requiring follow-up after 12 hours
    const leadsToFollowUp = await lmsService.getInactiveLeads(12);
    for (const lead of leadsToFollowUp) {
      await lmsService.updateLeadStatus(lead.id, "REQUIRES_FOLLOWUP", "No activity in 12 hours");
    }

    // Find leads becoming stale after 3 days
    const staleLeads = await lmsService.getInactiveLeads(72);
    for (const lead of staleLeads) {
      await lmsService.updateLeadStatus(lead.id, "STALE", "No activity in 3 days");
    }

    console.log("Automated lead status updates completed.");
  } catch (error) {
    console.error("Failed to update lead statuses:", error);
  }
};

export default updateLeadStatuses;
