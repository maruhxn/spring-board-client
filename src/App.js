import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./common/routes";
import { useState } from "react";
import { MemberContext } from "./context/member-context";

const queryClient = new QueryClient();

function App() {
  const [memberInfo, setMemberInfo] = useState(null);
  return (
    <MemberContext.Provider value={{ memberInfo, setMemberInfo }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </MemberContext.Provider>
  );
}

export default App;
