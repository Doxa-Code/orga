import {
  createAppointment,
  removeAppointment,
  retrieveAppointment,
  updateAppointment,
} from "@/app/actions/appointments";
import { retrieveProposalsFollowUps } from "@/app/actions/crm";
import {
  createOpenApiServerActionRouter,
  createRouteHandlers,
} from "zsa-openapi";

const router = createOpenApiServerActionRouter({
  pathPrefix: "/api",
})
  .post("/appointments", createAppointment)
  .get("/appointments", retrieveAppointment)
  .put("/appointments", updateAppointment)
  .delete("/appointments/:id", removeAppointment)
  .get("/proposals/follow-ups", retrieveProposalsFollowUps);

export const { GET, POST, PUT, DELETE } = createRouteHandlers(router);
