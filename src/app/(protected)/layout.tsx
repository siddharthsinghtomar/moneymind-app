import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#141c22] text-white font-sans selection:bg-[#6db89a]/30 flex">
      {children}
    </div>
  );
}
