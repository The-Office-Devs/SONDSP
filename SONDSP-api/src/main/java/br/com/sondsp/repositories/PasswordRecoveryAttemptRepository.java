package br.com.sondsp.repositories;

import br.com.sondsp.entities.PasswordRecoveryAttempt;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PasswordRecoveryAttemptRepository extends JpaRepository<PasswordRecoveryAttempt, Long> {

    @Query("""
            SELECT COUNT(attempt)
              FROM PasswordRecoveryAttempt attempt
             WHERE attempt.emailHash = :emailHash
               AND attempt.attemptedAt >= :since
            """)
    long countByEmailHashSince(
            @Param("emailHash") String emailHash,
            @Param("since") LocalDateTime since
    );

    @Query("""
            SELECT COUNT(attempt)
              FROM PasswordRecoveryAttempt attempt
             WHERE attempt.requestIp = :requestIp
               AND attempt.attemptedAt >= :since
            """)
    long countByRequestIpSince(
            @Param("requestIp") String requestIp,
            @Param("since") LocalDateTime since
    );
}
