package br.com.sondsp.repositories;

import br.com.sondsp.dtos.UsersListDetailsDTO;
import br.com.sondsp.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    UserDetails findByEmail(String email);
    Users getByEmail(String email);

    List<UsersListDetailsDTO> findAllByStatus(Boolean status);

    boolean existsByEmail(String email);

    Boolean findByEmailAndStatus(String email, Boolean status);
}
