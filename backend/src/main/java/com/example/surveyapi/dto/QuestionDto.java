package com.example.surveyapi.dto;

import java.util.List;

public class QuestionDto {
    public Long id;
    public String title;
    public String questionType;   // single/multiple/text
    public Integer isRequired;    // 0/1
    public Integer sortOrder;
    public List<OptionDto> options;
}