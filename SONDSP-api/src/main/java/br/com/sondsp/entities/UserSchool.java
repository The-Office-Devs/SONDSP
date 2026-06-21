package br.com.sondsp.entities;

import jakarta.persistence.*;

@Entity
public class UserSchool {
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "id_escola")
    private Integer schoolId;

    @Column(name = "atuacao")
    private String function;
}
