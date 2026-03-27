package com.example.surveyapi.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuestionnaireFullDto {
    public Long id;
    public String title;
    public String description;
    public LocalDateTime startTime;
    public LocalDateTime endTime;
    public List<QuestionDto> questions;
}