package br.com.sondsp.repositories;

import br.com.sondsp.entities.AccountActivationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AccountActivationAttemptRepository extends JpaRepository<AccountActivationAttempt, Long> {

    long countByEmailHashAndAttemptedAtGreaterThanEqual(String emailHash, LocalDateTime since);

    long countByRequestIpAndAttemptedAtGreaterThanEqual(String requestIp, LocalDateTime since);
}
