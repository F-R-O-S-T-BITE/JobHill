import HeaderWrapper from '@/components/HeaderWrapper';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El middleware ya se encarga de verificar autenticación
  return (
    <>
      <HeaderWrapper />
      <main>{children}</main>
    </>
  );
}