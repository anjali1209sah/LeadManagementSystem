import { Request, Response } from "express";
import lmsService from "../services/lms.service";

class LeadManagementController {
  async createLead(req: Request, res: Response) {
    try {
      const lead = await lmsService.createLead(req.body);
      res.status(201).json(lead);
    } catch (err : any ) {
      res.status(500).json({ error: err.message });
    }
  }

  async getLead(req: Request, res: Response) {
    try {
        console.log("===>", req.params.id)
      const lead = await lmsService.getLeadById(Number(req.params.id));
      res.status(200).json(lead);
    } catch (err : any ) {
      res.status(404).json({ error: "Lead not found" });
    }
  }

  async updateLead(req: Request, res: Response) {
    try {
      const lead = await lmsService.updateLead(Number(req.params.id), req.body);
      res.status(200).json(lead);
    } catch (err : any ) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateLeadStatus(req: Request, res: Response) {
    try {
      const { status, action, reason } = req.body;
      const lead = await lmsService.updateLeadStatus(Number(req.params.id), status, action, reason);
      res.status(200).json(lead);
    } catch (err : any ) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new LeadManagementController();
