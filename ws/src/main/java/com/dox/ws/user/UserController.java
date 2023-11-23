package com.dox.ws.user;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dox.ws.error.ApiError;
import com.dox.ws.shared.GenericMessage;

import jakarta.validation.Valid;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    // @CrossOrigin
    // post etmek için cross origin kullandık simdilik
    @PostMapping("/api/v1/users")
    GenericMessage createUser(@Valid @RequestBody User user) {
        // ApiError apiError = new ApiError();
        // apiError.setPath("/api/v1/users");
        // apiError.setMessage("Validation Error");
        // apiError.setStatus(400);
        // Map <String, String> validationErrors = new HashMap<>();

        // if (user.getUsername() == null || user.getUsername().isEmpty()) {
        //     validationErrors.put("username", "Username cannot be empty");
        //     // eger username yoksa bad request döndür
        // }

        // if (user.getEmail() == null || user.getEmail().isEmpty()) {
        //     validationErrors.put("email", "Email cannot be empty");
        // }

        // if(validationErrors.size() > 0) {
        //     apiError.setValidationErrors(validationErrors);
        //     return ResponseEntity.badRequest().body(apiError);
        // }
        userService.save(user);
        return new GenericMessage("User is created");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleMethodArgNotValidEx(MethodArgumentNotValidException exception){
        ApiError apiError = new ApiError();
        apiError.setPath("/api/v1/users");
        apiError.setMessage("Validation Error");
        apiError.setStatus(400);
        var validationErrors = exception.getBindingResult().getFieldErrors().stream().collect(
        Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (existing, replacement) -> existing));
        apiError.setValidationErrors(validationErrors);
        return ResponseEntity.badRequest().body(apiError);
    }
}
