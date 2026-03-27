package com.example.surveyapi.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class QuestionnaireStatsDto {
    public Long questionnaireId;
    public int totalResponses;
    public List<OptionCount> optionCounts = new ArrayList<>();
    public List<TextAnswer> textAnswers = new ArrayList<>();

    public static class OptionCount {
        public Long questionId;
        public Long optionId;
        public int count;
        public OptionCount(Long questionId, Long optionId, int count) {
            this.questionId = questionId;
            this.optionId = optionId;
            this.count = count;
        }
    }

    public static class TextAnswer {
        public Long questionId;
        public String text;
        public LocalDateTime submittedAt;
        public TextAnswer(Long questionId, String text, LocalDateTime submittedAt) {
            this.questionId = questionId;
            this.text = text;
            this.submittedAt = submittedAt;
        }
    }
}