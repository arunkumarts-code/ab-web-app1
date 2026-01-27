"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/contexts/AuthContext";
import GlobalLoader from "./GlobalLoader";

export default function AuthRoute({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, fbToken, loading } = UserAuth();
   const router = useRouter();

   useEffect(() => {
      if (loading) return;

      if (user && fbToken) {
         const redirectUrl = sessionStorage.getItem("redirectAfterLogin") ?? "/dashboard";
         sessionStorage.removeItem("redirectAfterLogin");

         router.replace(redirectUrl);
      }
   }, [user, fbToken, loading, router]);

   if (loading || (user && fbToken)) {
      return <GlobalLoader />;
   }

   return <>{children}</>;
}
