package br.com.sondsp.repositories;

import br.com.sondsp.dtos.UsersDetailsDTO;
import br.com.sondsp.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    UserDetails findByUsername(String username);

    List<UsersDetailsDTO> findAllByStatus(Boolean status);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Users findByUsernameOrEmail(String username, String email);
}
