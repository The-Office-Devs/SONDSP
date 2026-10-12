package br.com.sondsp.repositories;

import br.com.sondsp.entities.PasswordRecoveryAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PasswordRecoveryAttemptRepository extends JpaRepository<PasswordRecoveryAttempt, Long> {

    long countByEmailHashAndAttemptedAtGreaterThanEqual(String emailHash, LocalDateTime since);

    long countByRequestIpAndAttemptedAtGreaterThanEqual(String requestIp, LocalDateTime since);
}
