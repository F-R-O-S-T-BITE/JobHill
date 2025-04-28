export const metadata = {
  title: 'Jobhill',
  description: 'Helping you find your next oportunity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
