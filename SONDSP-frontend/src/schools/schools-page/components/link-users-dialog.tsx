import { useState, useMemo } from 'react';
import { Link2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { School } from '../../schools.types';
import { useUsers } from '../use-schools';

interface LinkUsersDialogProps {
  school: School | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkUsersDialog({ school, open, onOpenChange }: Readonly<LinkUsersDialogProps>) {
  const [filter, setFilter] = useState('');
  const { data: users = [], isLoading } = useUsers();

  const filteredUsers = useMemo(() => {
    if (!filter.trim()) return users;
    const lowerFilter = filter.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerFilter) ||
        u.registration.toLowerCase().includes(lowerFilter) ||
        u.email.toLowerCase().includes(lowerFilter),
    );
  }, [users, filter]);

  const handleLink = (userName: string) => {
    toast.success(`Usuário "${userName}" vinculado à escola "${school?.name}".`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vincular Usuários</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Input
            placeholder="Filtro Geral"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 border-slate-200 bg-white pr-10 text-sm"
          />
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="max-h-72 overflow-auto rounded-xl border border-slate-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#0a356d] text-white">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Matrícula ↓</th>
                <th className="px-4 py-2.5 text-left font-semibold">Nome ↓</th>
                <th className="px-4 py-2.5 text-left font-semibold">Função</th>
                <th className="px-4 py-2.5 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Carregando usuários...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-2.5 text-slate-900">{user.registration}</td>
                    <td className="px-4 py-2.5 text-slate-900">{user.name}</td>
                    <td className="px-4 py-2.5 text-slate-900">Professor</td>
                    <td className="px-4 py-2.5 text-center">
                      <Button
                        size="sm"
                        className="rounded-md bg-[#0a356d] px-4 text-white hover:bg-[#082d5d]"
                        onClick={() => handleLink(user.name)}
                      >
                        <Link2 className="size-4" />
                        Vincular
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
