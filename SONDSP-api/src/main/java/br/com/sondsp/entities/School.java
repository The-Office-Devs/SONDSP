package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "escola")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String name;

    @Column(name = "codigo_inep", unique = true, nullable = false, length = 8)
    private String codigoInep;

    @Column(name = "status")
    private Boolean status;
}
