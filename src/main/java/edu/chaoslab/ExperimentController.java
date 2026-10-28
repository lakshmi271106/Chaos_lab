package edu.chaoslab;
import jakarta.validation.Valid;import org.springframework.http.HttpStatus;import org.springframework.web.bind.annotation.*;import java.util.List;import java.util.Map;
@RestController @RequestMapping("/api") public class ExperimentController{
 private final ExperimentService service;public ExperimentController(ExperimentService s){service=s;}
 @GetMapping("/experiments") public List<Experiment> list(){return service.list();}@PostMapping("/experiments") @ResponseStatus(HttpStatus.CREATED) public Experiment create(@Valid @RequestBody ExperimentService.CreateRequest r){return service.create(r);}
 @GetMapping("/experiments/{id}") public Experiment get(@PathVariable long id){return service.get(id);}@PostMapping("/experiments/{id}/start") public Experiment start(@PathVariable long id){return service.start(id);}@PostMapping("/experiments/{id}/stop") public Experiment stop(@PathVariable long id){return service.stop(id);}@DeleteMapping("/experiments/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable long id){service.delete(id);}
 @GetMapping("/dashboard") public ExperimentService.Dashboard dashboard(){return service.dashboard();}@GetMapping("/health") public Object health(){return Map.of("status","UP","measurement","Application health; experiment readings are simulated");}
}
