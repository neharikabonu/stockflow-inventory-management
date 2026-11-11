
package com.stockflow.stockflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, Object>> handleRuntimeException(
          RuntimeException ex) {

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "error", ex.getMessage()
            )
    );
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(
          MethodArgumentNotValidException ex) {

    String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getDefaultMessage())
            .findFirst()
            .orElse("Invalid request");

    return ResponseEntity.badRequest().body(
            Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 400,
                    "error", message
            )
    );
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneralException(
          Exception ex) {

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 500,
                    "error", "An unexpected error occurred"
            )
    );
  }
}
