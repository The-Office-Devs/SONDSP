package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tblRole")
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRole")
    private Integer id;

    @Column(unique = true, nullable = false, name = "nome")
    private String name;
}