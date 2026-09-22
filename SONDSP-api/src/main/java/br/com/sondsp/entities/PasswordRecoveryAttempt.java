package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "password_recovery_attempt")
public class PasswordRecoveryAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email_hash", nullable = false, length = 64)
    private String emailHash;

    @Column(name = "request_ip", length = 45)
    private String requestIp;

    @Column(name = "attempted_at", nullable = false)
    private LocalDateTime attemptedAt;

    @Column(name = "outcome", nullable = false, length = 30)
    private String outcome;

    @Column(name = "reason")
    private String reason;
}
