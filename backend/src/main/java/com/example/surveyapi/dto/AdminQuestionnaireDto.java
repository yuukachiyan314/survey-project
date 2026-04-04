package com.example.surveyapi.dto;

import java.time.LocalDateTime;

public class AdminQuestionnaireDto {
    public Long id;
    public String title;
    public String description;     // 可為 null
    public Integer isPublished;    // 0/1
    public LocalDateTime startTime;
    public LocalDateTime endTime;
    public LocalDateTime createdAt;
    public Integer viewCount;
}