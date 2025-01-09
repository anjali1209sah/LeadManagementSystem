import {Router} from 'express';
import lmsController from '../controllers/lms.controller';

class LeadManagementSystemRouter{
    public router:Router;

    constructor(ExpressRouter : Router){
        this.router = ExpressRouter;
        this.getRouter();
        this.postRouter();
        this.putRouter();
        this.deleteRouter();

    }

    postRouter(){
        console.log("Inside postRoute")
        this.router.post('/lead' , lmsController.createLead)
    }

    getRouter(){
        console.log("Inside getRoute")
        this.router.get('/lead/:id' , lmsController.getLead)
        // this.router.get('/leads:id' , lmsController.getById)
    }

    putRouter(){
        console.log("Inside putRoute")
        this.router.put('/lead:id',lmsController.updateLead)
        this.router.put("/leads/:id/status", lmsController.updateLeadStatus);
    }

    deleteRouter(){
        console.log("Inside deleteRoute")
        // this.router.delete('/lead`:id',lmsController.delete)
    }
    
}

export default LeadManagementSystemRouter;


