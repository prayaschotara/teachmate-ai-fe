// app.tsx

import { RouterProvider } from "react-router";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { router } from "./routes/routes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className:
                "bg-white text-black dark:bg-gray-800 dark:text-white px-4 py-3 rounded-md shadow-md text-sm font-medium",
              style: {
                padding: "12px 16px",
              },
            }}
          />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </CookiesProvider>
    </ThemeProvider>
  );
}
