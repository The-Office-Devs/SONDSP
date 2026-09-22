CREATE TABLE password_reset_token (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id     INTEGER NOT NULL,
    token_hash  VARCHAR(64) NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used_at     TIMESTAMP NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    request_ip  VARCHAR(45),

    CONSTRAINT pk_password_reset_token PRIMARY KEY (id),
    CONSTRAINT fk_password_reset_token_user
        FOREIGN KEY (user_id) REFERENCES usuario (id)
);

CREATE INDEX idx_password_reset_token_hash
    ON password_reset_token (token_hash);

CREATE INDEX idx_password_reset_token_user
    ON password_reset_token (user_id);

CREATE TABLE password_recovery_attempt (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    email_hash      VARCHAR(64) NOT NULL,
    request_ip      VARCHAR(45),
    attempted_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    outcome         VARCHAR(30) NOT NULL,
    reason          VARCHAR(255),

    CONSTRAINT pk_password_recovery_attempt PRIMARY KEY (id)
);

CREATE INDEX idx_password_recovery_attempt_email_time
    ON password_recovery_attempt (email_hash, attempted_at);

CREATE INDEX idx_password_recovery_attempt_ip_time
    ON password_recovery_attempt (request_ip, attempted_at);
