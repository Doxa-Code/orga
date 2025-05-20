import { Menu } from "@/components/menu";
import { Globals } from "./globals";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Globals>
      <Menu>{children}</Menu>
    </Globals>
  );
}
