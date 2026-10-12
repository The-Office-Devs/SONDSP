package br.com.sondsp.controllers;

import br.com.sondsp.dtos.*;
import br.com.sondsp.filters.ClassMapFilter;
import br.com.sondsp.services.SchoolClassService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SchoolClassControllerTest {

    @Mock
    private SchoolClassService schoolClassService;

    @InjectMocks
    private SchoolClassControllerImpl schoolClassController;

    @Test
    @DisplayName("getClassMap deve delegar para o service e retornar ResponseEntity com ClassMapDTO")
    void getClassMap_success() {
        ClassMapFilter filter = new ClassMapFilter(1, 10, "Língua Portuguesa", 100, "2° Bimestre");
        ClassMapDTO mockDto = new ClassMapDTO(
                1,
                "EMEF São Paulo",
                10,
                "1° Ano A",
                List.of(new DomainPercentageDTO("Escrita de Palavras", 15, 20, 75.0)),
                List.of(new DistributionDTO("ALF", 15, 75.0), new DistributionDTO("PS", 5, 25.0)),
                List.of(new EvolutionComparativeDTO("ALF", 10, 15), new EvolutionComparativeDTO("PS", 10, 5))
        );

        when(schoolClassService.getClassMap(eq(10), any(ClassMapFilter.class))).thenReturn(mockDto);

        ResponseEntity<ClassMapDTO> response = schoolClassController.getClassMap(10, filter);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockDto, response.getBody());
        verify(schoolClassService).getClassMap(eq(10), any(ClassMapFilter.class));
    }
}
