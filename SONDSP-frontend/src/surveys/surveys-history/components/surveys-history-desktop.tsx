import { useState } from "react";
import { useParams } from "react-router-dom";

import type { SurveyListItem } from "@/surveys/surveys.types";
import type { SurveyHistoryFormData, SurveyHistoryFormInput } from "../survey-history.schema";
import { useDeleteSurvey, useStudentSurveys, useSurveyImage } from "@/surveys/use-surveys";
import { useActivityImage } from "@/activities/activities-page/use-activities";
import { useTableState } from "@/hooks/use-table-state";
import { useSessionState } from "@/hooks/use-session-state";
import { buildPaginationProps } from "@/api/types";

import { SurveysHistoryFilterPanel } from "./surveys-history-filter-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { FinishSurveyDialog } from "@/components/Dialog/FinishSurveyDialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { ViewFileDialog } from "@/components/Dialog/ViewFileDialog";
import { ReadOnlyField } from "@/components/ReadOnlyFields/ReadOnlyField";
import { getResultLabel } from "@/lib/survey-utils";

interface SavedSurveyHistoryFilter {
  data: SurveyHistoryFormData;
  values: SurveyHistoryFormInput;
}

const columns: ColumnDef<SurveyListItem>[] = [
  { id: "activity", key: "activityName", header: "Modelo de Atividade", width: "20%", accessor: (row) => row.activity?.name },
  { id: "activity", key: "subject", header: "Matéria", width: "10%", accessor: (row) => row.activity?.strand?.subject },
  { id: "activity", key: "strandName", header: "Eixo", width: "15%", accessor: (row) => row.activity?.strand?.name },
  { id: "activity", key: "bimester", header: "Ano - Bimestre", width: "15%", accessor: (row) => `${row.activity?.gradeLevel} - ${row.applicationPeriod}` },
  { id: "status", header: "Status", width: "10%", accessor: (row) => row.status ? "Finalizada" : "Em Aberto" }
];

export function SurveysHistoryDesktop() {
  const { id } = useParams();
  const studentId = Number(id);
  const filterKey = `survey-history-filter:${studentId}`;

  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5, filterKey);
  const [savedFilter, setSavedFilter] = useSessionState<SavedSurveyHistoryFilter | null>(
    `${filterKey}:applied`,
    null
  );
  const appliedFilters = savedFilter?.data ?? null;

  const [selectedSurvey, setSelectedSurvey] = useState<SurveyListItem | null>(null);
  const [surveyToDelete, setSurveyToDelete] = useState<SurveyListItem | null>(null);
  const [viewFile, setViewFile] = useState<SurveyListItem | null>(null);

  const { data: surveysPage, isFetching } = useStudentSurveys(
    studentId,
    {
      page,
      size,
      ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {}),
      ...(appliedFilters?.status != null ? { status: appliedFilters.status } : {}),
      ...(appliedFilters?.strandId ? { strandId: appliedFilters.strandId } : {}),
      ...(appliedFilters?.applicationPeriod ? { applicationPeriod: appliedFilters.applicationPeriod } : {})
    }
  );
  const useSurveyImg = !!viewFile && viewFile.status === true;

  const { mutate: deleteSurvey, isPending } = useDeleteSurvey();
  const { data: activityImageUrl, isFetching: isFetchingActivity } = useActivityImage(useSurveyImg ? undefined : viewFile?.activity?.id);
  const { data: surveyImageUrl, isFetching: isFetchingSurvey } = useSurveyImage(useSurveyImg ? viewFile?.id : undefined);

  const actions: RowAction<SurveyListItem>[] = [
    { type: "view", onClick: (surveyItem) => setViewFile(surveyItem) },
    { 
      type: "delete", 
      onClick: (surveyItem) => setSurveyToDelete(surveyItem),
      disabled: (surveyItem) => surveyItem.status
    },
    { 
      type: "finish", 
      label: "Finalizar", 
      onClick: (surveyItem) => setSelectedSurvey(surveyItem), 
      disabled: (surveyItem) => surveyItem.status 
    },
  ];

  const handleSearch = (data: SurveyHistoryFormData, values: SurveyHistoryFormInput) => {
    setSavedFilter({ data, values });
    setPage(0);
  };

  const handleClear = () => {
    setSavedFilter(null);
    setFilter("");
    setPage(0);
  };

  const imageUrl = useSurveyImg ? surveyImageUrl : activityImageUrl;
  const isFetchingImage = useSurveyImg ? isFetchingSurvey : isFetchingActivity;

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SurveysHistoryFilterPanel
        initialValues={savedFilter?.values}
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isFetching}
        studentId={studentId}
      />

      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<SurveyListItem>
        data={surveysPage?.content ?? []}
        columns={columns}
        rowKey={(surveyItem) => surveyItem.id}
        actions={actions}
        emptyMessage="Nenhuma sondagem encontrada."
        isFetching={isFetching}
        pagination={surveysPage ? buildPaginationProps(surveysPage, setPage) : undefined}
      />

      <ViewFileDialog
        fileUrl={imageUrl}
        title={isFetchingImage ? "Carregando arquivo..." : (viewFile?.activity.name ?? "")}
        open={viewFile !== null}
        onOpenChange={(open) => { if (!open) setViewFile(null) }}
      >
        {viewFile?.status && (
          <>
            <ReadOnlyField label="Resultado" value={getResultLabel(viewFile.result)} />
            {viewFile.notes && (
              <ReadOnlyField label="Observações" value={viewFile.notes} />
            )}
          </>
        )}
      </ViewFileDialog>

      <DeleteDialog<SurveyListItem>
        data={surveyToDelete}
        title="Excluir Sondagem"
        itemName={surveyToDelete?.activity?.name}
        open={!!surveyToDelete}
        onOpenChange={(open) => !open && setSurveyToDelete(null)}
        isPending={isPending}
        onConfirm={(survey) => deleteSurvey(survey.id as number, {
          onSuccess: () => setSurveyToDelete(null)
        })}
      />

      <FinishSurveyDialog
        data={selectedSurvey}
        open={!!selectedSurvey}
        onOpenChange={(open) => !open && setSelectedSurvey(null)}
      />
    </div>
  );
}