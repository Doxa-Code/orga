import { Menu } from "@/components/menu";
import { createClient } from "@/lib/supabase/server";
import { Globals } from "./globals";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Globals>
      <Menu
        user={{
          avatar: user?.user_metadata?.avatar ?? "",
          name: user?.user_metadata?.name ?? "",
          email: user?.email ?? "",
        }}
      >
        {children}
      </Menu>
    </Globals>
  );
}
