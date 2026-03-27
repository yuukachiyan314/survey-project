package com.example.surveyapi.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SubmitResponseRequest {
    public String respondentName;     // 可 null
    public LocalDateTime submittedAt; // 可 null，後端補 now()
    public List<AnswerItem> answers;

    public static class AnswerItem {
        public Long questionId;
        public List<Long> optionIds;  // single/multiple 用
        public String text;           // text 用
    }
}