import { startTransition, useTransition } from "react"
import { LogOut, Loader2 } from 'lucide-react';
import { logoutUserAction } from "@/actions/logoutAction";


export default function LogoutButton({ isMobile = false }) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutUserAction();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/10 border border-transparent hover:border-red-900/20 rounded-xl transition-all duration-200 disabled:opacity-40 group focus:outline-none ${
        isMobile ? 'mt-auto' : ''
      }`}
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin text-red-400" />
      ) : (
        <LogOut size={18} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
      )}
      <span>{isPending ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}