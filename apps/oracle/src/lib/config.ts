type ConfigNames = "orga.host";

export const config = new Map<ConfigNames, string>();

config.set("orga.host", process.env.ORGA_API_HOST ?? "");
