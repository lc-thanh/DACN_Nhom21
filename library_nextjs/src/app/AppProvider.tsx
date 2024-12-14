"use client";

import { clientTokens } from "@/lib/http";
import { useState } from "react";

// const AppContext = createContext({
//   sessionToken: "",
//   setSessionToken: (_sessionToken: string) => {},
// });

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
// };

// export default function AppProvider({
//   children,
//   initSessionToken = "",
// }: {
//   children: React.ReactNode;
//   initSessionToken?: string;
// }) {
//   const [sessionToken, setSessionToken] = useState(initSessionToken);
//   return (
//     <AppContext.Provider value={{ sessionToken, setSessionToken }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// Nhiệm vụ của AppProvider bây giờ không phải là Context API nữa
// Mà là để set giá trị cho clientSessionToken
export default function AppProvider({
  children,
  initTokens,
}: {
  children: React.ReactNode;
  initTokens: { accessToken?: string; refreshToken?: string };
}) {
  // Sử dụng useState() thay vì useEffect() có 2 lợi thế:
  // 1. useState() chạy cùng lúc với quá trình render, không cần chờ
  // render xong mới chạy => Nên sẽ chạy trước useEffect()
  // 2. useState() chỉ chạy 1 lần duy nhất
  useState(() => {
    // Nếu không phải môi trường server thì mới set giá trị cho clientSessionToken
    // Nếu không làm điều này thì sẽ bị lỗi khi chạy ở môi trường development
    // (Chạy ở môi trường production thì không sao)
    // Vì khi chạy ở môi trường development, các client component cũng sẽ chạy ở server
    if (typeof window !== "undefined") {
      clientTokens.accessToken = initTokens.accessToken ?? "";
      clientTokens.refreshToken = initTokens.refreshToken ?? "";
    }
  });
  return <>{children}</>;
}
