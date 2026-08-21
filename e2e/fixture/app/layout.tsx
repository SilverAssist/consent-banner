import "@silverassist/consent-banner/styles";

export const metadata = { title: "consent-banner e2e fixture" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
