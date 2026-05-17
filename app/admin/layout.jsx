export const metadata = { title: "Kendra Admin" };

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F5F5F3", color: "#111" }}>
        {children}
      </body>
    </html>
  );
}
