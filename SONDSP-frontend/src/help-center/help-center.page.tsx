import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, X, UserCog, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/auth/auth.store';
import { canAccess } from '@/auth/role-access';
import { useFooter } from '@/hooks/use-footer';
import { HELP_MODULES } from './help-center.data';
import type { HelpAudience } from './help-center.types';
import { HelpModuleSection } from './components/help-module-section';
import { HelpSupportFooter } from './components/help-support-footer';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);

  const isAdmin = user ? canAccess(user.role, 'admin') : false;
  const moduloParam = searchParams.get('modulo');

  // Inicializa o módulo selecionado a partir do query param ?modulo se existir
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() => {
    if (moduloParam && HELP_MODULES.some((m) => m.id === moduloParam)) {
      return moduloParam;
    }
    return 'all';
  });

  // Se o módulo inicial pertencer a uma audiência específica, seleciona essa audiência
  const [selectedAudience, setSelectedAudience] = useState<HelpAudience>(() => {
    if (moduloParam) {
      const targetMod = HELP_MODULES.find((m) => m.id === moduloParam);
      if (targetMod) {
        return targetMod.audience[0];
      }
    }
    return isAdmin ? 'admin' : 'professor';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Sincroniza se o parâmetro ?modulo mudar na URL
  useEffect(() => {
    if (moduloParam) {
      const targetMod = HELP_MODULES.find((m) => m.id === moduloParam);
      if (targetMod) {
        setSelectedModuleId(targetMod.id);
        setSelectedAudience(targetMod.audience[0]);
      }
    } else {
      setSelectedModuleId('all');
    }
  }, [moduloParam]);

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    if (id === 'all') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ modulo: id }, { replace: true });
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleExpandAll = () => {
    const allOpen = audienceModules.reduce<Record<string, boolean>>((acc, mod) => {
      acc[mod.id] = true;
      return acc;
    }, {});
    setExpandedModules(allOpen);
  };

  const handleCollapseAll = () => {
    setExpandedModules({});
  };

  // Configura botão "Voltar" e título no rodapé padrão do SONDSP
  useFooter({
    title: 'Central de Ajuda',
    leftAction: {
      label: 'Voltar',
      icon: <ArrowLeft className="size-4.5" />,
      onClick: () => navigate(-1),
    },
  });

  // Filtra módulos pela audiência (admin ou professor)
  const audienceModules = useMemo(() => {
    return HELP_MODULES.filter((module) =>
      module.audience.includes(selectedAudience),
    );
  }, [selectedAudience]);

  // Aplica filtro por busca e por módulo selecionado
  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return audienceModules
      .filter((module) => {
        if (selectedModuleId !== 'all' && module.id !== selectedModuleId) {
          return false;
        }
        return true;
      })
      .map((module) => {
        if (!query) return module;

        const matchingTopics = module.topics.filter((topic) => {
          const inTitle = topic.title.toLowerCase().includes(query);
          const inSteps = topic.steps.some((step) =>
            step.toLowerCase().includes(query),
          );
          const inAlert = topic.alert?.message.toLowerCase().includes(query);
          return inTitle || inSteps || inAlert;
        });

        return {
          ...module,
          topics: matchingTopics,
        };
      })
      .filter((module) => module.topics.length > 0);
  }, [audienceModules, selectedModuleId, searchQuery]);

  return (
    <div className="min-h-full bg-[#f2f4f8] px-4 py-8 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-6xl space-y-8 xl:max-w-7xl">
        {/* Cabeçalho da Página */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            Central de Ajuda
          </h1>
          <p className="text-base text-slate-600 lg:text-lg">
            Tutoriais passo a passo para as principais funcionalidades do sistema
          </p>
        </header>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Seletor de Perfil (visível quando o usuário for Administrador) */}
          {isAdmin && (
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedAudience('admin');
                  handleSelectModule('all');
                }}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
                  selectedAudience === 'admin'
                    ? 'bg-[#0a4b93] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                <UserCog className="size-4" />
                <span>Área do Administrador</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAudience('professor');
                  handleSelectModule('all');
                }}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
                  selectedAudience === 'professor'
                    ? 'bg-[#0a4b93] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                <GraduationCap className="size-4" />
                <span>Área do Professor</span>
              </button>
            </div>
          )}

          {/* Campo de Busca Textual */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 80))}
              maxLength={80}
              placeholder="Buscar tutoriais por título ou palavra-chave..."
              className="h-12 rounded-xl border-slate-200 bg-white pl-11 pr-10 text-base shadow-2xs placeholder:text-slate-400 focus-visible:border-[#0a4b93] focus-visible:ring-[#0a4b93]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar busca"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Pílulas de Módulos */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectModule('all')}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer',
              selectedModuleId === 'all'
                ? 'bg-[#0a4b93] text-white shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            Todos os Módulos
          </button>
          {audienceModules.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => handleSelectModule(mod.id)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer',
                selectedModuleId === mod.id
                  ? 'bg-[#0a4b93] text-white shadow-2xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              )}
            >
              {mod.title}
            </button>
          ))}
        </div>

        {/* Lista de Módulos e Tópicos */}
        {filteredModules.length > 0 ? (
          <div className="space-y-5">
            {selectedModuleId === 'all' && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-1">
                <span>Clique em um módulo para abrir e visualizar os tutoriais correspondentes</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExpandAll}
                    className="font-medium text-[#0a4b93] hover:underline cursor-pointer"
                  >
                    Expandir todos
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleCollapseAll}
                    className="font-medium text-slate-600 hover:underline cursor-pointer"
                  >
                    Recolher todos
                  </button>
                </div>
              </div>
            )}

            {filteredModules.map((module) => {
              const isCollapsible = selectedModuleId === 'all';
              const isExpanded =
                !isCollapsible ||
                searchQuery.trim().length > 0 ||
                Boolean(expandedModules[module.id]);

              return (
                <HelpModuleSection
                  key={module.id}
                  module={module}
                  isCollapsible={isCollapsible}
                  isExpanded={isExpanded}
                  onToggle={() => toggleModule(module.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 py-12 text-center">
            <Search className="size-8 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">
              Nenhum tutorial encontrado
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchQuery
                ? `Não encontramos resultados para "${searchQuery}". Tente usar outros termos.`
                : 'Não há tutoriais disponíveis para a seleção atual.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-[#0a4b93] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Limpar busca
              </button>
            )}
          </div>
        )}

        {/* Rodapé de Suporte Técnico */}
        <HelpSupportFooter />
      </div>
    </div>
  );
}
