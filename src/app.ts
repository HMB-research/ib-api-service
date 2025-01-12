import {MicroserviceApp} from "@waytrade/microservice-core";
import path from "path";
import {IBApiServiceConfig} from "./config";
import {IBApiController} from "./controllers";
import {IBApiService} from "./services/ib-api-service";

/** List of controllers on the endpoint */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONTROLLERS = [IBApiService];

/** List of services on the app */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SERVICES = [IBApiController];

/**
 * The Interactive Brokers TWS API service App.
 */
export class IBApiApp extends MicroserviceApp {
  constructor() {
    super(path.resolve(__dirname, ".."));
  }

  /** Get the service config */
  static get config(): IBApiServiceConfig {
    return <IBApiServiceConfig>IBApiApp.context.config;
  }

  /** Called when the context has booted, before the API service is started. */
  async onBoot(): Promise<void> {
    // increase port for paper trading mode in docker
    if (!IBApiApp.config.IB_GATEWAY_PORT) {
      if (IBApiApp.config.TRADING_MODE === "live") {
        IBApiApp.config.IB_GATEWAY_PORT = 4001;
      } else if (IBApiApp.config.TRADING_MODE === "paper") {
        IBApiApp.config.IB_GATEWAY_PORT = 4002;
      }
    }
    IBApiApp.info(`IB Gateway host: ${IBApiApp.config.IB_GATEWAY_HOST}`);
    IBApiApp.info(`IB Gateway port: ${IBApiApp.config.IB_GATEWAY_PORT}`);
  }

  /** Called when the microservice has been started. */
  onStarted(): void {
    IBApiApp.info(
      `Server is running at port ${IBApiApp.context.config.SERVER_PORT}`,
    );
  }
}
