package br.com.sondsp.services;

import br.com.sondsp.entities.User;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.ActivationForm;
import br.com.sondsp.form.ChangePasswordForm;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.repositories.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

@Service
@AllArgsConstructor
public class UsersService {
    private UsersRepository repository;

    public User getUser(Integer id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
    }

    public User getByEmail(String email) {
        User user = repository.findByEmail(email);

        if (user == null)
            throw new EntityNotFoundException(EMAIL_NOT_FOUND);

        return user;
    }

    public List<User> getUsers(UserFilter filter) {
        Specification<User> spec = buildFilter(filter);
        return repository.findAll(spec);
    }

    public User save(User user) {
        return repository.save(user);
    }

    public User updateUser(Integer idUser, UserForm user) {
        validadeUser(user);

        return User.updateUserWithUserForm(getUser(idUser), user);
    }

    public User changePassword(ChangePasswordForm form){
        User user = repository.findByEmail(form.email());

        if (user == null) throw new EntityNotFoundException(EMAIL_NOT_FOUND);

        if (user.getStatus()){
            user.setPassword(encodePassword(form.password()));

            return repository.save(user);
        } else {
            throw new ValidationException(INACTIVATED_USER);
        }
    }

    public User activateUser(ActivationForm form) {
        User user = repository.findByEmailAndRegistration(form.email(), form.registration());

        if (user == null) throw new EntityNotFoundException(EMAIL_OR_REGISTRATION_NOT_FOUND);

        if (!user.getStatus()){
            user.setPassword(encodePassword(form.password()));
            user.setStatus(true);
            return repository.save(user);
        } else {
            throw new ValidationException(USER_ALREADY_ACTIVE);
        }
    }

    public void deleteUser(Integer idUser) {
        User userToDelete = getUser(idUser);
        userToDelete.setStatus(false);
        repository.save(userToDelete);
    }

    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    private Specification<User> buildFilter(UserFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.name() != null && !filter.name().isBlank())
                predicates.add(criteriaBuilder.like(criteriaBuilder
                        .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));


            if (filter.role() != null)
                predicates.add(criteriaBuilder.equal(root.get("role"), filter.role()));


            if (filter.email() != null && !filter.name().isBlank())
                predicates.add(criteriaBuilder.like(criteriaBuilder
                        .lower(root.get("email")), "%" + filter.email().toLowerCase() + "%"));

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void validadeUser(UserForm user) {
        validateEmail(user.email());
    }

    private void validateEmail(String email) {
        if (repository.existsByEmail(email))
            throw new ValidationException(EMAIL_ALREADY_EXISTS);
    }

    public String encodePassword(String password){
        return new BCryptPasswordEncoder().encode(password);
    }
}
