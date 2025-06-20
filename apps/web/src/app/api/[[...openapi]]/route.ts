import { createAppointment } from "@/app/actions/appointments";
import {
  createOpenApiServerActionRouter,
  createRouteHandlers,
} from "zsa-openapi";

const router = createOpenApiServerActionRouter({
  pathPrefix: "/api",
}).post("/appointments", createAppointment);

export const { GET, POST, PUT } = createRouteHandlers(router);
