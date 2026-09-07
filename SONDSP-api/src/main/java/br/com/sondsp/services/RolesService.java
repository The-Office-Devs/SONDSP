package br.com.sondsp.services;

import br.com.sondsp.entities.Role;
import br.com.sondsp.repositories.RolesRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import static br.com.sondsp.util.SystemMessages.ROLE_NOT_FOUND;

@Service
@AllArgsConstructor
public class RolesService {
    private RolesRepository repository;

    public Role getRoleByName(String name) {
        return repository.getRoleByName(name).orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));
    }
}
