package br.com.sondsp.services;

import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.School;
import br.com.sondsp.entities.SchoolClass;
import br.com.sondsp.entities.User;
import br.com.sondsp.exceptions.UserAlreadyExistsException;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.*;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import br.com.sondsp.repositories.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import static br.com.sondsp.util.SystemMessages.*;

@Service
@AllArgsConstructor
public class UsersService {
    private UsersRepository repository;
    private final RolesRepository rolesRepository;
    private final PermissionsRepository permissionsRepository;

    private SchoolClassService schoolClassService;
    private SchoolService schoolService;

    public User registerUser(RegisterForm form) {
        User verifyUser = repository.findByEmailOrRegistration(form.email(), form.registration());

        if (verifyUser != null) {
            if (Objects.equals(verifyUser.getEmail(), form.email()))
                throw new UserAlreadyExistsException(EMAIL_ALREADY_EXISTS);

            if (Objects.equals(verifyUser.getRegistration(), form.registration()))
                throw new UserAlreadyExistsException(REGISTRATION_ALREADY_EXISTS);
        }

        return save(User.builder()
                .name(form.name())
                .registration(form.registration())
                .role(rolesRepository.getRoleByName(form.role()))
                .status(false)
                .email(form.email())
                .password(null)
                .permissions(permissionsRepository.findAllByPermissionIn(form.permissions()))
                .build());
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

    public User updateUser(Integer id, UserForm form) {
        User user = getUser(id);

        user.setName(form.name());
        user.setRegistration(form.registration());
        user.setRole(rolesRepository.getRoleByName(form.role()));
        user.setEmail(form.email());
        user.setPermissions(permissionsRepository.findAllByPermissionIn(form.permissions()));

        validadeUser(form, user);

        return repository.save(user);
    }

    public Boolean linkToSchoolClass(Integer id, Integer schoolClassId) {
        // Busca o usuário e a turma
        User user = getUser(id);
        SchoolClass schoolClass = schoolClassService.getSchoolClass(schoolClassId);

        // Se encontrar a turma, remove ela
        if (!user.getSchoolClasses().removeIf(sc -> Objects.equals(sc.getId(), schoolClassId))) {
            // Se não tiver removido, adiciona a turma e retorna true
            user.getSchoolClasses().add(schoolClass);
            return true;
        }

        return false;
    }

    public Boolean linkToSchool(Integer id, Integer schoolId) {
        // Busca o usuário e a escola
        User user = getUser(id);
        School school = schoolService.getSchool(schoolId);

        // Se encontrar a escola, remove ela
        if (!user.getSchools().removeIf(s -> Objects.equals(s.getId(), schoolId))) {
            // Se não tiver removido, adiciona a escola e retorna true
            user.getSchools().add(school);
            return true;
        }

        return false;
    }

    public Boolean changeStatus(Integer id) {
        User user = getUser(id);

        user.setStatus(!user.getStatus());

        return repository.save(user).getStatus();
    }

    public User changePassword(ChangePasswordForm form){
        User user = repository.findByEmail(form.email());

        if (user == null) throw new EntityNotFoundException(USER_NOT_FOUND);

        if (user.getStatus()){
            user.setPassword(encodePassword(form.newPassword()));

            return repository.save(user);
        } else {
            throw new ValidationException(INACTIVATED_USER);
        }
    }

    public User findByEmailAndRegistration(String email, String registration) {
        return repository.findByEmailAndRegistration(email, registration);
    }

    private Specification<User> buildFilter(UserFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                Join<User, Role> roleJoin = root.join("role", JoinType.INNER);

                String searchPattern = "%" + filter.search().toLowerCase() + "%";

                Predicate searchInName = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate searchInEmail = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern);
                Predicate searchInRegistration = criteriaBuilder.like(criteriaBuilder.lower(root.get("registration")), searchPattern);
                Predicate searchInRole = criteriaBuilder.like(criteriaBuilder.lower(roleJoin.get("name")), searchPattern);

                Predicate combinedSearchPredicate = criteriaBuilder.or(searchInName, searchInEmail, searchInRegistration, searchInRole);

                predicates.add(combinedSearchPredicate);
            } else {
                if (filter.name() != null && !filter.name().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));

                if (filter.registration() != null && !filter.registration().isBlank())
                    predicates.add(criteriaBuilder.equal(criteriaBuilder
                            .lower(root.get("registration")), "%" + filter.registration().toLowerCase() + "%"));

                if (filter.roleName() != null && !filter.roleName().isBlank()) {
                    Join<User, Role> roleJoin = root.join("role", JoinType.INNER);

                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(roleJoin.get("name")),
                            "%" + filter.roleName().toLowerCase() + "%"
                    ));
                }

                if (filter.email() != null && !filter.email().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("email")), "%" + filter.email().toLowerCase() + "%"));
            }

            if (filter.status() != null)
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void validadeUser(UserForm userForm, User user) {
        if (!Objects.equals(user.getEmail(), userForm.email()) && repository.existsByEmail(userForm.email()))
            throw new ValidationException(EMAIL_ALREADY_EXISTS);
    }

    public String encodePassword(String password){
        return new BCryptPasswordEncoder().encode(password);
    }
}
