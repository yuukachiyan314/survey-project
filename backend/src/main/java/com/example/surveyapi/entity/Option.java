package com.example.surveyapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="question_id", nullable=false)
    private Long questionId;

    @Column(name="option_text", nullable=false)
    private String optionText;

    @Column(name="sort_order")
    private Integer sortOrder;

    public Long getId() { return id; }
    public Long getQuestionId() { return questionId; }
    public String getOptionText() { return optionText; }
    public Integer getSortOrder() { return sortOrder; }

    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public void setOptionText(String optionText) { this.optionText = optionText; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}