"use client";

import accountApiRequests from "@/apiRequests/account";
import ButtonLogout from "@/components/button-logout";
import { useEffect } from "react";

export default function MeProfile() {
  useEffect(() => {
    const fetchMe = async () => {
      const result = await accountApiRequests.meClient();
      console.log(result);
    };
    fetchMe();
  }, []);

  return (
    <div>
      <ButtonLogout />
      <h1>Welcome</h1>
    </div>
  );
}
