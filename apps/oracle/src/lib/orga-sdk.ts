import axios, { AxiosInstance } from "axios";
import { config } from "./config";
import { URLSearchParams } from "url";

namespace OrgaSDK {
  export type CreateAppointment = {
    description: string;
    scheduledAt: string;
    createdBy: string;
  };
  export type UpdateAppointment = {
    description?: string;
    scheduledAt?: string;
    createdBy?: string;
    id: string;
  };
  export type RetrieveFollowUps = {
    start: string;
    end: string;
    stage?: string;
  };
}

export class OrgaSDK {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.get("orga.host"),
    });
  }

  get appointments() {
    return {
      create: async (props: OrgaSDK.CreateAppointment) => {
        await this.client.post("/api/appointments", props);
      },
      retrieve: async (start: string, end: string) => {
        const response = await this.client.get(
          `/api/appointments?start=${start}&end=${end}`
        );

        return response.data;
      },
      update: async (props: OrgaSDK.UpdateAppointment) => {
        const response = await this.client.put("/api/appointments", props);

        return response.data;
      },
      remove: async (id: string) => {
        await this.client.delete(`/api/appointments/${id}`);
      },
    };
  }

  get crm() {
    return {
      followUps: async (props: OrgaSDK.RetrieveFollowUps) => {
        const params = new URLSearchParams(props);
        const response = await this.client.get(
          `/api/proposals/follow-ups?${params.toString()}`
        );

        return response.data;
      },
    };
  }

  static create() {
    return new OrgaSDK();
  }
}
