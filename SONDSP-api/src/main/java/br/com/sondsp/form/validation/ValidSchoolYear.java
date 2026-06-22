package br.com.sondsp.form.validation;

import jakarta.validation.Payload;

public @interface ValidSchoolYear {
    String message();
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
