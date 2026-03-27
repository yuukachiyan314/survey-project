package com.example.surveyapi.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="questionnaire_id", nullable=false)
    private Long questionnaireId;

    @Column(nullable=false, length=255)
    private String title;

    @Column(name="question_type", nullable=false, length=30)
    private String questionType; // single / multiple / text

    @Column(name="is_required")
    private Integer isRequired; // 0/1

    @Column(name="sort_order")
    private Integer sortOrder;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public Long getQuestionnaireId() { return questionnaireId; }
    public String getTitle() { return title; }
    public String getQuestionType() { return questionType; }
    public Integer getIsRequired() { return isRequired; }
    public Integer getSortOrder() { return sortOrder; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setQuestionnaireId(Long questionnaireId) { this.questionnaireId = questionnaireId; }
    public void setTitle(String title) { this.title = title; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }
    public void setIsRequired(Integer isRequired) { this.isRequired = isRequired; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}