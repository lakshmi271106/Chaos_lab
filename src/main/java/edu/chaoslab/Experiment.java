package edu.chaoslab;
import jakarta.persistence.*;import java.time.Instant;
@Entity public class Experiment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name; @Column(length=1000) private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Scenario scenario;
 @Column(nullable=false) private int durationSeconds,intensity;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private State status=State.CREATED;
 private Instant createdAt=Instant.now(),startedAt,endedAt; private long observedResponseMs; private boolean recovered; private String observation="Awaiting run";
 protected Experiment(){} public Experiment(String n,String d,Scenario s,int dur,int i){name=n;description=d;scenario=s;durationSeconds=dur;intensity=i;}
 public Long getId(){return id;} public String getName(){return name;} public String getDescription(){return description;} public Scenario getScenario(){return scenario;} public int getDurationSeconds(){return durationSeconds;} public int getIntensity(){return intensity;} public State getStatus(){return status;} public Instant getCreatedAt(){return createdAt;} public Instant getStartedAt(){return startedAt;} public Instant getEndedAt(){return endedAt;} public long getObservedResponseMs(){return observedResponseMs;} public boolean isRecovered(){return recovered;} public String getObservation(){return observation;}
 public void start(){if(status!=State.CREATED)throw new IllegalStateException("Only created experiments can start");status=State.RUNNING;startedAt=Instant.now();observation="Safe simulation running";}
 public void complete(long ms,boolean rec,String note){if(status!=State.RUNNING)return;status=State.COMPLETED;endedAt=Instant.now();observedResponseMs=ms;recovered=rec;observation=note;}
 public void stop(){if(status!=State.RUNNING)throw new IllegalStateException("Only running experiments can stop");status=State.STOPPED;endedAt=Instant.now();recovered=true;observation="Stopped by user; simulation finalized safely";}
 public enum Scenario{RESPONSE_DELAY,CPU_STRESS,MEMORY_PRESSURE,NETWORK_LATENCY,SERVICE_FAILURE} public enum State{CREATED,RUNNING,COMPLETED,FAILED,STOPPED}
}
