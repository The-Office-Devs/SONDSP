import { useState, useMemo } from 'react';

import type { School } from '../schools.types';
import { useSchools } from './use-schools';

import { SchoolRegistrationPanel } from './components/school-registration-panel';
import { SchoolFilterBar } from './components/school-filter-bar';
import { SchoolsTable } from './components/schools-table';
import { EditSchoolDialog } from './components/edit-school-dialog';
import { DeleteSchoolDialog } from './components/delete-school-dialog';
import { LinkUsersDialog } from './components/link-users-dialog';

export function SchoolsPage() {
  const { data: schools = [], isLoading } = useSchools();
  const [filter, setFilter] = useState('');

  // Dialog state
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [deleteSchool, setDeleteSchool] = useState<School | null>(null);
  const [linkUsersSchool, setLinkUsersSchool] = useState<School | null>(null);

  const filteredSchools = useMemo(() => {
    //TODO: implementar paginação na tabela e filtro disparando requisição para o backend
    if (!filter.trim()) return schools;
    const lowerFilter = filter.toLowerCase();
    return schools.filter((s) => s.name.toLowerCase().includes(lowerFilter));
  }, [schools, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando escolas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SchoolRegistrationPanel />
      <SchoolFilterBar value={filter} onChange={setFilter} />
      <SchoolsTable
        schools={filteredSchools}
        onEdit={(school) => setEditSchool(school)}
        onDelete={(school) => setDeleteSchool(school)}
        onLinkUsers={(school) => setLinkUsersSchool(school)}
      />

      <EditSchoolDialog
        school={editSchool}
        open={editSchool !== null}
        onOpenChange={(open) => { if (!open) setEditSchool(null); }}
      />

      <DeleteSchoolDialog
        school={deleteSchool}
        open={deleteSchool !== null}
        onOpenChange={(open) => { if (!open) setDeleteSchool(null); }}
      />

      <LinkUsersDialog
        school={linkUsersSchool}
        open={linkUsersSchool !== null}
        onOpenChange={(open) => { if (!open) setLinkUsersSchool(null); }}
      />
    </div>
  );
}
