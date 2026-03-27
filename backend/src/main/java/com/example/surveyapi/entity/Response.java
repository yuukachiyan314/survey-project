package com.example.surveyapi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "responses")
public class Response {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "questionnaire_id", nullable = false)
  private Long questionnaireId;

  @Column(name = "respondent_name")
  private String respondentName;

  @Column(name = "submitted_at", nullable = false)
  private LocalDateTime submittedAt;

  public Long getId() { return id; }
  public Long getQuestionnaireId() { return questionnaireId; }
  public void setQuestionnaireId(Long questionnaireId) { this.questionnaireId = questionnaireId; }
  public String getRespondentName() { return respondentName; }
  public void setRespondentName(String respondentName) { this.respondentName = respondentName; }
  public LocalDateTime getSubmittedAt() { return submittedAt; }
  public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}