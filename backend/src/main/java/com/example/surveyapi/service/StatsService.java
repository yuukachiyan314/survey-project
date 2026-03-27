package com.example.surveyapi.service;

import com.example.surveyapi.dto.QuestionnaireStatsDto;
import com.example.surveyapi.entity.Answer;
import com.example.surveyapi.entity.Response;
import com.example.surveyapi.repository.AnswerRepository;
import com.example.surveyapi.repository.ResponseRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatsService {

    private final ResponseRepository responseRepository;
    private final AnswerRepository answerRepository;

    public StatsService(ResponseRepository responseRepository, AnswerRepository answerRepository) {
        this.responseRepository = responseRepository;
        this.answerRepository = answerRepository;
    }

    public QuestionnaireStatsDto getStats(Long questionnaireId) {
        QuestionnaireStatsDto dto = new QuestionnaireStatsDto();
        dto.questionnaireId = questionnaireId;

        // 1) 找這份問卷的所有 responses
        List<Response> responses = responseRepository.findByQuestionnaireIdOrderByIdDesc(questionnaireId);
        dto.totalResponses = responses.size();

        if (responses.isEmpty()) return dto;

        // 2) 收集 responseIds
        List<Long> responseIds = new ArrayList<>();
        for (Response r : responses) responseIds.add(r.getId());

        // 3) 找這些 responses 的所有 answers
        List<Answer> answers = answerRepository.findByResponseIdIn(responseIds);

        // 4) 統計：questionId + optionId -> count
        Map<String, Integer> countMap = new HashMap<>();

        for (Answer a : answers) {
            // 選項題：option_id != null
            if (a.getOptionId() != null) {
                String key = a.getQuestionId() + ":" + a.getOptionId();
                countMap.put(key, countMap.getOrDefault(key, 0) + 1);
            }

            // 文字題：answer_text 有值
            if (a.getAnswerText() != null && !a.getAnswerText().trim().isEmpty()) {
                // 找 submittedAt：用 responseId 對回 responses（新手寫法：用 map）
                // 先建立 responseId -> submittedAt 的 map（放在迴圈外也行）
            }
        }

        // responseId -> submittedAt map（放這裡比較清楚）
        Map<Long, java.time.LocalDateTime> timeMap = new HashMap<>();
        for (Response r : responses) timeMap.put(r.getId(), r.getSubmittedAt());

        // 再跑一次把文字塞進去（保持好懂）
        for (Answer a : answers) {
            if (a.getAnswerText() != null && !a.getAnswerText().trim().isEmpty()) {
                dto.textAnswers.add(
                        new QuestionnaireStatsDto.TextAnswer(
                                a.getQuestionId(),
                                a.getAnswerText().trim(),
                                timeMap.get(a.getResponseId())
                        )
                );
            }
        }

        // 把 countMap 轉成 dto.optionCounts
        for (String key : countMap.keySet()) {
            String[] parts = key.split(":");
            Long qid = Long.valueOf(parts[0]);
            Long oid = Long.valueOf(parts[1]);
            int c = countMap.get(key);
            dto.optionCounts.add(new QuestionnaireStatsDto.OptionCount(qid, oid, c));
        }

        // 排序一下（好看）
        dto.optionCounts.sort(Comparator
                .comparing((QuestionnaireStatsDto.OptionCount x) -> x.questionId)
                .thenComparing(x -> x.optionId));

        dto.textAnswers.sort((a, b) -> b.submittedAt.compareTo(a.submittedAt));

        return dto;
    }
}