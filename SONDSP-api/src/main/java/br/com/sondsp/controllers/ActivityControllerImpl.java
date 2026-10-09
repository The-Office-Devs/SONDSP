package br.com.sondsp.controllers;

import br.com.sondsp.dtos.ActivityDTO;
import br.com.sondsp.dtos.ImageDTO;
import br.com.sondsp.dtos.PageResponse;
import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.ActivityFilter;
import br.com.sondsp.form.ActivityForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.ActivityService;
import br.com.sondsp.util.SystemMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/activity")
public class ActivityControllerImpl {
    @Autowired
    private ActivityService activityService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> registerActivity(@ModelAttribute ActivityForm activityForm) throws IOException {
        Optional<User> creator = authenticationService.getCurrentUser();
        if (creator.isPresent()) {
            return ResponseEntity.ok().body(
                    new ActivityDTO(activityService.registerActivity(activityForm, creator.get())));
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, SystemMessages.USER_NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new ActivityDTO(activityService.getActivity(id)));
    }

    @GetMapping()
    public ResponseEntity<PageResponse<ActivityDTO>> listActivity(
            @ModelAttribute ActivityFilter filter,
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "status", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "strand.subject", direction = Sort.Direction.ASC),
                    @SortDefault(sort = "name", direction = Sort.Direction.ASC, caseSensitive = false)
            }) Pageable pageable) {

        Page<Activity> activityPage = activityService.getActivities(filter, pageable);

        List<ActivityDTO> contentDTO = activityPage.getContent().stream()
                .map(ActivityDTO::new)
                .toList();

        PageResponse<ActivityDTO> response = new PageResponse<>(
                contentDTO,
                activityPage.getNumber(),
                activityPage.getSize(),
                activityPage.getTotalElements(),
                activityPage.getTotalPages(),
                activityPage.hasNext(),
                activityPage.hasPrevious()
        );

        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> changeActivityStatus(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new ActivityDTO(activityService.changeActivityStatus(id)));
    }

    @GetMapping("get-activity-image/{id}")
    public ResponseEntity<?> getActivityImage(@PathVariable Integer id) {
        String imageUrl = activityService.getActivityImageSignedUrl(id);

        return ResponseEntity.ok().body(new ImageDTO(imageUrl));
    }
}
