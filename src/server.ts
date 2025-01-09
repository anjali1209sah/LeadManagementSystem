import cors from 'cors';
import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import cron from "node-cron";
import * as bodyParser from 'body-parser'
import LeadManagementSystemRouter from './routes/lms.routes';
import updateLeadStatuses from './jobs/lms_status_update.job';
import AuthenticationRouter from './routes/auth.routes';


dotenv.config();

cron.schedule("0 * * * *", updateLeadStatuses); // Runs every hour

export class Server {
  public app: express.Application = express();
  public port: string | number = process.env.PORT || 4000;
  public router: express.Router = express.Router();
  constructor() {
    this.setConfigurations();
    this.setCors();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }
  setConfigurations() { 
    this.configureBodyParser(); 
  } 

  configureBodyParser() { 
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 
    this.app.use(bodyParser.json({ limit: '50mb' })); 
    this.app.use(passport.initialize());
  } 

  setCors() { 
    const corsOptions = { 
      origin: "*", 
      methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'] 
    };
    this.app.use(cors(corsOptions))
  } 

  setRoutes() {
    this.app.use('/',new AuthenticationRouter(this.router).router)
    this.app.use('/api/v1', new LeadManagementSystemRouter(this.router).router);
  }

  error404Handler() {
    this.app.use((req, res) => {
      console.log("route not found ==> " , req.body )
      res.status(404).json({ message: 'Not Found', status_code: 404 });
    })
  }

  handleErrors() {
    this.app.use((error: any, req: any, res: any, next: any) => {
      const errorStatus = error.code;
      console.log("in handle errors - ", error)
      const errResonse = {
        status: error.status, code: errorStatus,
        error: [{ type: error.type, message: error.message }]
      }
      console.log("in handle errors return - ", errResonse)
      res.status(errorStatus).json(errResonse);
    })
  }

}
