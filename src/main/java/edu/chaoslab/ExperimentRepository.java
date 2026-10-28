package edu.chaoslab;
import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface ExperimentRepository extends JpaRepository<Experiment,Long>{List<Experiment> findAllByOrderByCreatedAtDesc();long countByStatus(Experiment.State status);}
