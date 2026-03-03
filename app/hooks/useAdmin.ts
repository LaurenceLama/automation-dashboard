import { useState } from "react";
import { createClient } from "../utils/supabase/client";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const showAdminPanel = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { data: adminCheck } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    const isAdmin = !!adminCheck;

    if (isAdmin) {
      setIsAdmin(true);
    }
  };

  showAdminPanel();

  return isAdmin;
}
