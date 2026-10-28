package edu.chaoslab;
import org.springframework.http.*;import org.springframework.web.bind.MethodArgumentNotValidException;import org.springframework.web.bind.annotation.*;import java.util.Map;
@RestControllerAdvice public class ApiErrors{
 @ExceptionHandler(ExperimentService.NotFoundException.class) ResponseEntity<?> missing(RuntimeException e){return ResponseEntity.status(404).body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(IllegalStateException.class) ResponseEntity<?> conflict(RuntimeException e){return ResponseEntity.status(409).body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> invalid(MethodArgumentNotValidException e){return ResponseEntity.badRequest().body(Map.of("error","Invalid request: check required fields and limits"));}
}
