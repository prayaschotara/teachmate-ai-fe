import { RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDarkMode } from "./hooks/useDarkMode";
import { router } from "./routes/routes";

const queryClient = new QueryClient();

function AppContent() {
  const isDarkMode = useDarkMode();

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDarkMode ? '#374151' : '#fff',
              color: isDarkMode ? '#fff' : '#374151',
              border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
            },
          }}
        />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default function App() {
  return <AppContent />;
}
