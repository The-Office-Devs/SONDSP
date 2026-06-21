package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.dtos.UsersListDTO;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.LinkSchoolClassForm;
import br.com.sondsp.form.LinkSchoolForm;
import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.services.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.*;

@RestController
@RequestMapping("/user")
public class UsersControllerImpl implements UsersController {
    @Autowired
    private UsersService service;

    @PostMapping()
    public ResponseEntity<?> register(@Valid @RequestBody RegisterForm form) {
        return ResponseEntity.ok().body(new RegisterDTO(service.registerUser(form)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new UserDTO(service.getUser(id)));
    }

    @GetMapping()
    public ResponseEntity<PageResponse<UsersListDTO>> listUser(
            @ModelAttribute UserFilter filter,
            @PageableDefault(size = 5) Pageable pageable) {

        Page<User> userPage = service.getUsers(filter, pageable);

        List<UsersListDTO> contentDTO = userPage.getContent().stream()
                .map(UsersListDTO::new)
                .toList();

        PageResponse<UsersListDTO> response = new PageResponse<>(
                contentDTO,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.hasNext(),
                userPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserForm user) {
        return ResponseEntity.ok().body(new UserDTO(service.updateUser(id, user)));
    }

    @PatchMapping("/{id}/linkSchoolClass")
    public ResponseEntity<?> linkToSchoolClass(@PathVariable Integer id, @Valid @RequestBody LinkSchoolClassForm form) {
        if (service.linkToSchoolClass(id, form))
            return ResponseEntity.ok().body(USER_LINKED_TO_SCHOOL_CLASS);

        return ResponseEntity.ok().body(USER_UNLINKED_TO_SCHOOL_CLASS);
    }

    @PatchMapping("/{id}/linkSchool")
    public ResponseEntity<?> linkToSchool(@PathVariable Integer id, @Valid @RequestBody LinkSchoolForm form) {
        if (service.linkToSchool(id, form))
            return ResponseEntity.ok().body(USER_LINKED_TO_SCHOOL);

        return ResponseEntity.ok().body(USER_UNLINKED_TO_SCHOOL);
    }

    @PatchMapping("/{id}/changeStatus")
    public ResponseEntity<?> changeStatus(@PathVariable Integer id) {
        if (service.changeStatus(id))
            return ResponseEntity.ok(USER_ACTIVATED);

        return ResponseEntity.ok(USER_DEACTIVATED);
    }
}
