import "./globals.css";
import { TRPCProvider } from "@/trpc/client";

export const metadata = {
  title: "Task Manager",
  description: "Simple task manager with tRPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
