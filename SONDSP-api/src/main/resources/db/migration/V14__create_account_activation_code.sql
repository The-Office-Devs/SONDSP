CREATE TABLE account_activation_code (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id         INTEGER NOT NULL,
    code_hash       VARCHAR(64) NOT NULL,
    expires_at      TIMESTAMP NOT NULL,
    used_at         TIMESTAMP NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    request_ip      VARCHAR(45),

    CONSTRAINT pk_account_activation_code PRIMARY KEY (id),
    CONSTRAINT fk_account_activation_code_user
        FOREIGN KEY (user_id) REFERENCES usuario (id) ON DELETE CASCADE
);

CREATE INDEX idx_account_activation_code_hash
    ON account_activation_code (code_hash);

CREATE INDEX idx_account_activation_code_user
    ON account_activation_code (user_id);

CREATE TABLE account_activation_attempt (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    email_hash      VARCHAR(64) NOT NULL,
    request_ip      VARCHAR(45),
    attempted_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    outcome         VARCHAR(30) NOT NULL,
    reason          VARCHAR(255),

    CONSTRAINT pk_account_activation_attempt PRIMARY KEY (id)
);

CREATE INDEX idx_account_activation_attempt_email_time
    ON account_activation_attempt (email_hash, attempted_at);

CREATE INDEX idx_account_activation_attempt_ip_time
    ON account_activation_attempt (request_ip, attempted_at);
