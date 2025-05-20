import baseTheme, { contentList } from "@orga/ui/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: contentList,
  presets: [baseTheme],
};

export default config;
