package br.com.sondsp.services;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.User;
import br.com.sondsp.exceptions.UserAlreadyExistsException;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.*;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
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
import java.util.Objects;
import java.util.Set;

import static br.com.sondsp.util.SystemMessages.*;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@AllArgsConstructor
public class UsersService {
    private UsersRepository repository;
    private final RolesRepository rolesRepository;
    private final PermissionsRepository permissionsRepository;

    public User registerUser(RegisterForm form) {
        if (!existsByEmail(form.email()))
            return User.buildUserWithRegisterForm(form, getRole(form.role()), getUserPermissions(form.permissions()));

        User user = getByEmail(form.email());

        if (user.getStatus())
            throw new UserAlreadyExistsException(USER_ALREADY_EXISTS);

        return save(User.updateUserWithRegisterForm(form, getRole(form.role()), getUserPermissions(form.permissions())));
    }

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

    public User updateUser(Integer id, UserForm userForm) {
        User user = getUser(id);

        validadeUser(userForm, user);

        return repository.save(User.updateUserWithUserForm(getUser(id), userForm));
    }

    public User changePassword(ChangePasswordForm form){
        User user = repository.findByEmail(form.email());

        if (user == null) throw new EntityNotFoundException(USER_NOT_FOUND);

        if (user.getStatus()){
            user.setPassword(encodePassword(form.password()));

            return repository.save(user);
        } else {
            throw new ValidationException(INACTIVATED_USER);
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

    public User findByEmailAndRegistration(String email, String registration) {
        return repository.findByEmailAndRegistration(email, registration);
    }

    private Specification<User> buildFilter(UserFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.name() != null && !filter.name().isBlank())
                predicates.add(criteriaBuilder.like(criteriaBuilder
                        .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));


            if (filter.role() != null)
                predicates.add(criteriaBuilder.equal(root.get("role"), filter.role()));

            if (filter.email() != null && !filter.email().isBlank())
                predicates.add(criteriaBuilder.like(criteriaBuilder
                        .lower(root.get("email")), "%" + filter.email().toLowerCase() + "%"));

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void validadeUser(UserForm userForm, User user) {
        if (!Objects.equals(user.getEmail(), userForm.email()) && repository.existsByEmail(userForm.email()))
            throw new ValidationException(EMAIL_ALREADY_EXISTS);
    }

    public Set<Permission> getUserPermissions(List<String> permissions){
        return permissionsRepository.findAllByPermissionIn(permissions);
    }

    private Role getRole(String role){
        return rolesRepository.getRoleByName(role);
    }

    public String encodePassword(String password){
        return new BCryptPasswordEncoder().encode(password);
    }
}
