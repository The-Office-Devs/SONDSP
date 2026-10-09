package br.com.sondsp.exceptions;

import static br.com.sondsp.util.SystemMessages.UNABLE_TO_SAVE_IMAGE;

public class GenericImageException extends RuntimeException {
    public GenericImageException() {
        super(UNABLE_TO_SAVE_IMAGE);
    }
}
