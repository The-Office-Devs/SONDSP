package br.com.sondsp.repositories;

import br.com.sondsp.entities.AccountActivationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountActivationCodeRepository extends JpaRepository<AccountActivationCode, Long> {

    Optional<AccountActivationCode> findFirstByUserIdAndCodeHashOrderByCreatedAtDesc(Integer userId, String codeHash);

    List<AccountActivationCode> findAllByUserIdAndUsedAtIsNullAndExpiresAtGreaterThan(Integer userId, LocalDateTime now);
}
