"use client";

import accountApiRequests from "@/apiRequests/account";
import { useEffect } from "react";

export default function MeProfile() {
  useEffect(() => {
    const fetchMe = async () => {
      const result = await accountApiRequests.meClient();
      console.log(result);
    };
    fetchMe();
  }, []);
  // const cookieStore = await cookies();
  // const sessionToken = cookieStore.get("sessionToken")?.value;

  return <div>Welcome</div>;
}
