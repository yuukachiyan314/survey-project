package com.example.surveyapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "answers")
public class Answer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "response_id", nullable = false)
  private Long responseId;

  @Column(name = "question_id", nullable = false)
  private Long questionId;

  @Column(name = "option_id")
  private Long optionId;

  @Column(name = "answer_text")
  private String answerText;

  public Long getId() { return id; }
  public Long getResponseId() { return responseId; }
  public void setResponseId(Long responseId) { this.responseId = responseId; }
  public Long getQuestionId() { return questionId; }
  public void setQuestionId(Long questionId) { this.questionId = questionId; }
  public Long getOptionId() { return optionId; }
  public void setOptionId(Long optionId) { this.optionId = optionId; }
  public String getAnswerText() { return answerText; }
  public void setAnswerText(String answerText) { this.answerText = answerText; }
}