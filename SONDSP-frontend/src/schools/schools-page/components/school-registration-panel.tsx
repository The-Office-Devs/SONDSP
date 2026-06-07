import { useState } from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateSchool } from '../use-schools';

export function SchoolRegistrationPanel() {
  const [name, setName] = useState('');
  const [director, setDirector] = useState('');
  const { mutate, isPending } = useCreateSchool();

  const handleSubmit = () => {
    if (!name.trim()) return;
    mutate({ name: name.trim() });
    setName('');
    setDirector('');
  };

  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-slate-950">Cadastro de Escola</h2>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="school-name" className="text-sm font-normal text-slate-700">
              Nome
            </Label>
            <Input
              id="school-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da escola"
              className="h-10 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-director" className="text-sm font-normal text-slate-700">
              Diretor
            </Label>
            <Input
              id="school-director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="Nome do diretor"
              className="h-10 bg-white"
            />
          </div>

          <div className="flex lg:justify-end">
            <Button
              className="h-10 rounded-full px-6 shadow-sm"
              size="lg"
              onClick={handleSubmit}
              disabled={isPending || !name.trim()}
            >
              <Check className="size-4" />
              {isPending ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
