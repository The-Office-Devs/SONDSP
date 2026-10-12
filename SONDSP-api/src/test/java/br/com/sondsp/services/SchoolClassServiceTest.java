package br.com.sondsp.services;

import br.com.sondsp.dtos.ClassMapDTO;
import br.com.sondsp.entities.*;
import br.com.sondsp.filters.ClassMapFilter;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.repositories.SchoolClassRepository;
import br.com.sondsp.repositories.StrandRepository;
import br.com.sondsp.repositories.StudentRepository;
import br.com.sondsp.repositories.SurveyRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchoolClassServiceTest {

    @Mock
    private SchoolClassRepository repository;

    @Mock
    private SchoolService schoolService;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StrandRepository strandRepository;

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private SurveyRepository surveyRepository;

    @InjectMocks
    private SchoolClassService schoolClassService;

    private School school;
    private SchoolClass schoolClass;
    private Strand strand;
    private Student student1;
    private Student student2;
    private Activity activity1;
    private Activity activity2;

    @BeforeEach
    void setUp() {
        school = School.builder().id(1).name("EMEF São Paulo").status(true).build();
        schoolClass = SchoolClass.builder().id(10).name("1° Ano A").school(school).status(true).build();
        strand = Strand.builder().id(100).name("Escrita").subject("Língua Portuguesa").status(true).build();

        student1 = Student.builder().id(101).name("Ana Silva").schoolClass(schoolClass).status(true).build();
        student2 = Student.builder().id(102).name("Bruno Lima").schoolClass(schoolClass).status(true).build();

        activity1 = Activity.builder()
                .id(201)
                .name("Escrita de Palavras")
                .strand(strand)
                .status(true)
                .period("1° Bimestre")
                .build();

        activity2 = Activity.builder()
                .id(202)
                .name("Escrita de Palavras")
                .strand(strand)
                .status(true)
                .period("2° Bimestre")
                .build();
    }

    @Test
    @DisplayName("Deve calcular mapa de classe com sucesso quando período não for informado")
    void getClassMap_withoutPeriod_success() {
        ClassMapFilter filter = new ClassMapFilter(1, 10, "Língua Portuguesa", 100, null);

        when(repository.findById(10)).thenReturn(Optional.of(schoolClass));
        when(strandRepository.findById(100)).thenReturn(Optional.of(strand));
        when(studentRepository.findAllBySchoolClassIdAndStatusTrue(10)).thenReturn(List.of(student1, student2));
        when(activityRepository.findAllByStrandIdAndStatusTrue(100)).thenReturn(List.of(activity1, activity2));

        // student1 fez duas sondagens: 10/03 ("PS") e 20/05 ("ALF")
        Survey s1Antes = Survey.builder()
                .id(1)
                .student(student1)
                .activity(activity1)
                .result("PS")
                .status(true)
                .date(LocalDateTime.of(2026, 3, 10, 10, 0))
                .build();

        Survey s1Depois = Survey.builder()
                .id(2)
                .student(student1)
                .activity(activity2)
                .result("ALF")
                .status(true)
                .date(LocalDateTime.of(2026, 5, 20, 10, 0))
                .build();

        // student2 fez apenas uma sondagem: 20/05 ("SV")
        Survey s2Depois = Survey.builder()
                .id(3)
                .student(student2)
                .activity(activity2)
                .result("SV")
                .status(true)
                .date(LocalDateTime.of(2026, 5, 20, 11, 0))
                .build();

        when(surveyRepository.findCompletedSurveysByClassAndStrand(10, 100))
                .thenReturn(List.of(s2Depois, s1Depois, s1Antes));

        ClassMapDTO result = schoolClassService.getClassMap(10, filter);

        assertNotNull(result);
        assertEquals(1, result.schoolId());
        assertEquals("EMEF São Paulo", result.schoolName());
        assertEquals(10, result.schoolClassId());
        assertEquals("1° Ano A", result.schoolClassName());

        // Verificando distribuição (baseada na última sondagem: student1=ALF, student2=SV -> total 2)
        assertNotNull(result.distribuicao());
        var distAlf = result.distribuicao().stream().filter(d -> d.nivel().equals("ALF")).findFirst().orElseThrow();
        assertEquals(1, distAlf.quantidade());
        assertEquals(50.0, distAlf.percentual());

        var distSv = result.distribuicao().stream().filter(d -> d.nivel().equals("SV")).findFirst().orElseThrow();
        assertEquals(1, distSv.quantidade());
        assertEquals(50.0, distSv.percentual());

        var distPs = result.distribuicao().stream().filter(d -> d.nivel().equals("PS")).findFirst().orElseThrow();
        assertEquals(0, distPs.quantidade());
        assertEquals(0.0, distPs.percentual());

        // Verificando evolução comparativo:
        // Antes: student1=PS -> total 1
        // Depois: student1=ALF, student2=SV -> total 2
        assertNotNull(result.evolucaoComparativo());
        var evoPs = result.evolucaoComparativo().stream().filter(e -> e.nivel().equals("PS")).findFirst().orElseThrow();
        assertEquals(1, evoPs.antes());
        assertEquals(0, evoPs.depois());

        var evoAlf = result.evolucaoComparativo().stream().filter(e -> e.nivel().equals("ALF")).findFirst().orElseThrow();
        assertEquals(0, evoAlf.antes());
        assertEquals(1, evoAlf.depois());

        // Verificando percentual_dominio:
        // Atividade "Escrita de Palavras" -> student1=ALF (atingiu), student2=SV (não atingiu) -> 1 de 2 = 50.0%
        assertNotNull(result.percentualDominio());
        assertEquals(1, result.percentualDominio().size());
        var dominio = result.percentualDominio().get(0);
        assertEquals("Escrita de Palavras", dominio.nome());
        assertEquals(1, dominio.quantidadeEsperada());
        assertEquals(2, dominio.total());
        assertEquals(50.0, dominio.percentual());
    }

    @Test
    @DisplayName("Deve filtrar pelo bimestre quando informado e recuperar sondagem anterior no tempo")
    void getClassMap_withPeriod_success() {
        ClassMapFilter filter = new ClassMapFilter(1, 10, "Língua Portuguesa", 100, "2° Bimestre");

        when(repository.findById(10)).thenReturn(Optional.of(schoolClass));
        when(strandRepository.findById(100)).thenReturn(Optional.of(strand));
        when(studentRepository.findAllBySchoolClassIdAndStatusTrue(10)).thenReturn(List.of(student1));
        when(activityRepository.findAllByStrandIdAndStatusTrue(100)).thenReturn(List.of(activity1, activity2));

        Survey s1Bim1 = Survey.builder()
                .id(1)
                .student(student1)
                .activity(activity1)
                .result("PS")
                .status(true)
                .date(LocalDateTime.of(2026, 3, 10, 10, 0))
                .build();

        Survey s1Bim2 = Survey.builder()
                .id(2)
                .student(student1)
                .activity(activity2)
                .result("ALF")
                .status(true)
                .date(LocalDateTime.of(2026, 5, 20, 10, 0))
                .build();

        when(surveyRepository.findCompletedSurveysByClassAndStrand(10, 100))
                .thenReturn(List.of(s1Bim2, s1Bim1));

        ClassMapDTO result = schoolClassService.getClassMap(10, filter);

        assertNotNull(result);
        var distAlf = result.distribuicao().stream().filter(d -> d.nivel().equals("ALF")).findFirst().orElseThrow();
        assertEquals(1, distAlf.quantidade());
        assertEquals(100.0, distAlf.percentual());

        var evoPs = result.evolucaoComparativo().stream().filter(e -> e.nivel().equals("PS")).findFirst().orElseThrow();
        assertEquals(1, evoPs.antes());
        assertEquals(0, evoPs.depois());

        var evoAlf = result.evolucaoComparativo().stream().filter(e -> e.nivel().equals("ALF")).findFirst().orElseThrow();
        assertEquals(0, evoAlf.antes());
        assertEquals(1, evoAlf.depois());
    }

    @Test
    @DisplayName("Deve lançar ValidationException quando strandId for nulo")
    void getClassMap_missingStrandId_throwsValidationException() {
        ClassMapFilter filter = new ClassMapFilter(1, 10, "Língua Portuguesa", null, null);
        when(repository.findById(10)).thenReturn(Optional.of(schoolClass));

        assertThrows(ValidationException.class, () -> schoolClassService.getClassMap(10, filter));
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando eixo não for encontrado")
    void getClassMap_strandNotFound_throwsEntityNotFoundException() {
        ClassMapFilter filter = new ClassMapFilter(1, 10, "Língua Portuguesa", 999, null);
        when(repository.findById(10)).thenReturn(Optional.of(schoolClass));
        when(strandRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> schoolClassService.getClassMap(10, filter));
    }

    @Test
    @DisplayName("Deve retornar métricas zeradas quando não houver sondagens")
    void getClassMap_noSurveys_returnsZeroMetrics() {
        ClassMapFilter filter = new ClassMapFilter(1, 10, "Língua Portuguesa", 100, null);

        when(repository.findById(10)).thenReturn(Optional.of(schoolClass));
        when(strandRepository.findById(100)).thenReturn(Optional.of(strand));
        when(studentRepository.findAllBySchoolClassIdAndStatusTrue(10)).thenReturn(List.of(student1));
        when(activityRepository.findAllByStrandIdAndStatusTrue(100)).thenReturn(List.of(activity1));
        when(surveyRepository.findCompletedSurveysByClassAndStrand(10, 100)).thenReturn(List.of());

        ClassMapDTO result = schoolClassService.getClassMap(10, filter);

        assertNotNull(result);
        assertEquals(1, result.percentualDominio().size());
        assertEquals(0, result.percentualDominio().get(0).quantidadeEsperada());
        assertEquals(0, result.percentualDominio().get(0).total());
        assertEquals(0.0, result.percentualDominio().get(0).percentual());

        assertEquals(5, result.distribuicao().size());
        assertTrue(result.distribuicao().stream().allMatch(d -> d.quantidade() == 0 && d.percentual() == 0.0));

        assertEquals(5, result.evolucaoComparativo().size());
        assertTrue(result.evolucaoComparativo().stream().allMatch(e -> e.antes() == 0 && e.depois() == 0));
    }
}
