import { COLORS } from "@/lib/theme";

export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100dvh",
        maxWidth: "430px",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
