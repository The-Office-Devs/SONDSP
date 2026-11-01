import { useMemo } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";

import type { Role, Permission } from "../../roles.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RolePermissionsDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolePermissionsDialog({
  role,
  open,
  onOpenChange,
}: Readonly<RolePermissionsDialogProps>) {
  const groupedPermissions = useMemo(() => {
    if (!role?.permissions) return {};
    return role.permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
      const area = perm.area && perm.area.trim() ? perm.area.trim() : "Geral";
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(perm);
      return acc;
    }, {});
  }, [role]);

  if (!role) return null;

  const totalPermissions = role.permissions?.length ?? 0;
  const areas = Object.keys(groupedPermissions).sort();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="border-b pb-4 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {role.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Permissões ativas e acessos concedidos a esta função
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant={role.isAdmin ? "destructive" : "secondary"}
              className="px-2.5 py-0.5 text-xs font-semibold"
            >
              {role.isAdmin ? "Acesso Total (Admin)" : `${totalPermissions} permissões`}
            </Badge>
          </div>
        </DialogHeader>

        {role.isAdmin && (
          <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs shrink-0">
            <ShieldAlert className="size-4 shrink-0 text-amber-600" />
            <span>
              Esta função possui acesso pleno a todas as ações e ferramentas do sistema de forma irrevogável.
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          {totalPermissions === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Esta função ainda não possui nenhuma permissão vinculada.
            </div>
          ) : (
            areas.map((area) => (
              <div
                key={area}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {area}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {groupedPermissions[area].length} permissõ{groupedPermissions[area].length > 1 ? "es" : "ão"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groupedPermissions[area].map((perm) => (
                    <div
                      key={perm.id || perm.permission}
                      className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs"
                    >
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-900 leading-tight">
                          {perm.description || perm.permission}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                          {perm.permission}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="border-t pt-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
