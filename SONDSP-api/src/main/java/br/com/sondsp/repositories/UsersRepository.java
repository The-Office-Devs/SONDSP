package br.com.sondsp.repositories;

import br.com.sondsp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {

    User findByEmail(String email);

    User findByEmailAndRegistration(String email, String registration);

    boolean existsByEmail(String email);

}
