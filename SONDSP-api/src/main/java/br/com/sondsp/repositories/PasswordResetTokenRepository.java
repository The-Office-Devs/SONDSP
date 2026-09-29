package br.com.sondsp.repositories;

import br.com.sondsp.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("""
            UPDATE PasswordResetToken token
               SET token.usedAt = :usedAt
             WHERE token.user.id = :userId
               AND token.usedAt IS NULL
               AND token.expiresAt > :now
            """)
    int invalidateActiveTokens(
            @Param("userId") Integer userId,
            @Param("now") LocalDateTime now,
            @Param("usedAt") LocalDateTime usedAt
    );
}
