package br.com.sondsp.dtos.portfolio;

import br.com.sondsp.entities.User;

public record AnnotationAuthorDTO(
    Integer id,
    String name,
    String role,
    String roleLabel,
    String prefix
) {
    public AnnotationAuthorDTO(User user) {
        this(
            user.getId(),
            user.getName(),
            user.getRole() != null ? user.getRole().getName() : "USER",
            user.getRole() != null ? user.getRole().getName() : "Usuário",
            user.getRole() != null && "COORDINATOR".equalsIgnoreCase(user.getRole().getName()) ? "CP." : "Prof."
        );
    }
}
